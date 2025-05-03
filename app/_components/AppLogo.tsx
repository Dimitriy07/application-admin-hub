import Image from "next/image";
import Link from "next/link";

function AppLogo() {
  const imageStyle = {
    width: "100%",
    height: "100%",
  };
  return (
    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
      <Link href="/">
        <Image
          src="/mtl-logo.png"
          alt="application logo"
          width={50}
          height={50}
          style={imageStyle}
        />
      </Link>
    </div>
  );
}

export default AppLogo;
