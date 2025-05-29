import Link from "next/link";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import CardWrapper from "./CardWrapper";
import PopupWindow from "./PopupWindow";
import ResourcesMessage from "./ResourcesMessage";
import Button from "./Button";

function TooManyRequests({ nextAttemptAt }: { nextAttemptAt?: string }) {
  return (
    <PopupWindow>
      <CardWrapper>
        <ResourcesMessage
          message={`Too Many Requests have been made. Try again at ${nextAttemptAt}`}
        />
        <CardWrapper.CardButtons>
          <Link href={DEFAULT_LOGIN_REDIRECT}>
            <Button>Back</Button>
          </Link>
        </CardWrapper.CardButtons>
      </CardWrapper>
    </PopupWindow>
  );
}

export default TooManyRequests;
