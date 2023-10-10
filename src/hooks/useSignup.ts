import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/db/firebase.config";
import { updateUserDetails } from "@/store/slice/userSlice";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";
import { FirebaseError } from "firebase/app";
import formSchema from "@/schema/schema.signupForm";
import User from "@/types/types.user";
import handleFirebaseError from "@/services/firebase-firestore/firebaseErrorHandling";

const useSignup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [openEmailSent, setOpenEmailSent] = React.useState<boolean>(false);
  const [emailSentTo, setEmailSentTo] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [loadingCwg, setLoadingCwg] = React.useState<boolean>(false);

  const form: UseFormReturn<z.infer<typeof formSchema>> = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      gender: "",
      password: "",
    },
  });

  const addUserToDB = async ({
    values,
    uid,
  }: {
    values: z.infer<typeof formSchema>;
    uid: string;
  }): Promise<void> => {
    const userObj: User = {
      email: values.email,
      displayName: values?.fullName,
      gender: values.gender,
      emailVerified: false,
      friends: [],
      uid: uid,
    };
    try {
      await setDoc(doc(db, "users", uid), userObj);
    } catch (error) {
      console.log(error);
    }
  };

  // Firebase function to send email
  const sendVerificationEmail = async (
    userCred: UserCredential
  ): Promise<void> => {
    try {
      await sendEmailVerification(userCred.user); // Firebase function for sending email verification to created user
      setOpenEmailSent(true); // it opens Email sent Modal
      setEmailSentTo(userCred.user.email!); // This will set the user email we have sent email in above line which we will use in dialog modal
    } catch (error) {
      const message = handleFirebaseError(error as FirebaseError);
      toast({ variant: "destructive", description: message });
    }
  };

  // This function will execute on clicking signup form submit button
  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    const { fullName, email, password } = values;
    try {
      setLoading(true);

      const userCred: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // creating user using email and password in firebase
      if (!userCred) {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
        });
        setLoading(false);
        return;
      }

      // adding display name in firebase authentication profile
      await updateProfile(auth.currentUser!, {
        displayName: fullName,
      });

      await addUserToDB({ values, uid: userCred.user.uid }); // This will add user details in firestore
      await sendVerificationEmail(userCred); // Firebase email verification
      setLoading(false); // setting loading of submit button false

      toast({
        description: "Congrats! Account created account!",
      });
    } catch (error: unknown) {
      const message = handleFirebaseError(error as FirebaseError);
      toast({ variant: "destructive", description: message });
    }
  }

  // Social Logins

  const continueWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const userCred: UserCredential | null = await signInWithPopup(
        auth,
        provider
      );
      if (!userCred) return;
      setLoadingCwg(true); // enable signin with google loading till navigate to '/'
      const userObj: User | null = await addUserToDbAuthGoogle(userCred);
      if (!userObj) return;
      dispatch(updateUserDetails({ ...userObj }));
      dispatch(setAuthenticationStatus(true));
      toast({
        description: `Welcome ,${userObj.displayName}!`,
      });
      router.push("/");

      setTimeout(() => {
        setLoadingCwg(false);
      }, 2000);
    } catch (error) {
      const message = handleFirebaseError(error as FirebaseError);
      toast({ variant: "destructive", description: message });
    }
  };

  const addUserToDbAuthGoogle = async (
    userCred: UserCredential
  ): Promise<User | null> => {
    const { user } = userCred;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        // checking if this user data already exists in firestore then return
        return userDoc.data() as User;
      }

      const userObj: User = {
        displayName: user.displayName || "",
        email: user.email || "",
        emailVerified: user.emailVerified,
        friends: [],
        gender: "",
        uid: user.uid,
      };

      await setDoc(doc(db, "users", user.uid), { ...userObj });
      return userObj;
    } catch (error) {
      const message = handleFirebaseError(error as FirebaseError);
      toast({ variant: "destructive", description: message });
      return null;
    }
  };

  const continueWithFacebook = async (): Promise<void> => {
    try {
      const provider = new FacebookAuthProvider();
      const user = await signInWithPopup(auth, provider);
      console.log(user);
    } catch (error) {
      const message = handleFirebaseError(error as FirebaseError);
      toast({ variant: "destructive", description: message });
    }
  };

  return {
    form,
    onSubmit,
    emailSentTo,
    loading,
    openEmailSent,
    setOpenEmailSent,
    continueWithGoogle,
    loadingCwg,
    continueWithFacebook,
  };
};

export default useSignup;
