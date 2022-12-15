import { FC, useCallback } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon/Icon";
import { getMarketplaceUrl } from "../../utils/marketplace";

export const FeedbackButton: FC = () => {
  const onClick = useCallback(() => {
    window.open(getMarketplaceUrl(), "_blank", "noopener,noreferrer");
  }, []);

  return (
    <Button onClick={onClick} type="secondary" size="small">
      <Icon icon="comment-feedback" /> Send feedback
    </Button>
  );
};
