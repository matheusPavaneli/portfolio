"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wrapper com borda em gradiente que “gira” suavemente no hover — efeito premium e raro.
 * Use com classe "group" no pai se o hover for no card inteiro.
 */
export function ShineBorder({ children, className = "" }: Props) {
  return (
    <div className={`shine-border group relative rounded-2xl ${className}`}>
      <span className="shine-border-gradient" aria-hidden />
      <span className="shine-border-mask" aria-hidden />
      <span className="relative z-10 block h-full">{children}</span>
    </div>
  );
}
