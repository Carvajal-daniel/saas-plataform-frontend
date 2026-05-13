
import { twMerge } from 'tailwind-merge'

const Gradient = ({ 
  primaryColor = "var(--primary)", 
  secondaryColor = "var(--secondary)",
  className = "" 
}) => {
  return (
    <div 
      className={twMerge(
        // CLASSES PADRÃO (O que estava no seu código original)
        "pointer-events-none absolute left-1/2 top-1/4 md:top-1/2 h-[300px] w-[300px] -translate-x-[80%] -translate-y-1/2 rounded-full blur-[80px] md:h-[600px] md:w-[800px] md:blur-[130px] opacity-60",
        // CLASSES EXTRAS (O que você passa de fora agora SUBSTITUI o padrão)
        className
      )}
      style={{
        background: `linear-gradient(to bottom right, ${primaryColor} 40%, ${secondaryColor} 10%, transparent)`
      }}
    />
  )
}

export default Gradient