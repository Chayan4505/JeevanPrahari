export function JeevanPrahariLogo({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="JeevanPrahari Logo" 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}

export default JeevanPrahariLogo;
