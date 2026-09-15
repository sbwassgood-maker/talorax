import { Button } from '../ui';
import { useAppState } from '../../services/appState';

// "I Can Help" — the response to a "People Who Need You" prompt. Makes TALORAX
// two-directional: you can offer to help someone whose need matches your skills.
export function ICanHelpButton({
  needId,
  size = 'sm',
  block = false,
}: {
  needId: string;
  size?: 'sm' | 'md';
  block?: boolean;
}) {
  const { hasOfferedHelp, offerHelp } = useAppState();
  const offered = hasOfferedHelp(needId);

  if (offered) {
    return (
      <Button variant="secondary" size={size} block={block} disabled>
        ✓ Offered to help
      </Button>
    );
  }
  return (
    <Button variant="highlight" size={size} block={block} onClick={() => offerHelp(needId)}>
      I Can Help
    </Button>
  );
}
