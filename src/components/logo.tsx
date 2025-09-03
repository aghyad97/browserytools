import Image from "next/image";

export default function Logo() {
  return (
    <Image
      className="dark:invert"
      src="/icon.svg"
      alt="Browsery Tools"
      width={28}
      height={28}
    />
  );
}
