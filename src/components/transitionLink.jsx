import { useTransition } from "../context/transitionContext";

/**
 * TransitionLink — lien interne.
 * Autre page : joue la transition rideau. Même page : scroll vers l'ancre.
 * Reste un vrai <a href> (clic molette, Ctrl+clic, lecteurs d'écran).
 */
function TransitionLink({ to, onClick, children, ...rest }) {
  const { go } = useTransition();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

export default TransitionLink;
