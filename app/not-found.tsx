import Link from "next/link";
import CardWrapper from "./_components/CardWrapper";
import Button from "./_components/Button";
import { DEFAULT_LOGIN_REDIRECT } from "./routes";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <CardWrapper>
        <CardWrapper.CardLabel>PAGE NOT FOUND</CardWrapper.CardLabel>
        <CardWrapper.CardContent>
          Could not find requested resource
        </CardWrapper.CardContent>
        <Link href={DEFAULT_LOGIN_REDIRECT}>
          <Button>Return Home</Button>
        </Link>
      </CardWrapper>
    </div>
  );
}
