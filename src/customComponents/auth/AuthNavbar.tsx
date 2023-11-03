import messengerLogo from "@/../assets/images/messengerlogo.png";
import Image from "next/image";
import { TypographyH1 } from "../web/TypographyH1";

const AuthNavbar = () => {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-y-5">
      <Image src={messengerLogo} alt="messenger logo" width={65} height={65} loading="eager" />
      <TypographyH1 text="Messenger" />
    </div>
  );
};

export default AuthNavbar;
