import { useState } from "react"
import { Link } from "react-router-dom"
import { FaWhatsapp } from "react-icons/fa"
import { FiMail, FiX } from "react-icons/fi"
import CallModels from "../../assets/images/CallModels.jpg"

const ModelsButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="
          relative inline-flex items-center justify-center
          px-6 py-3
          bg-pink-400 text-white
          overflow-hidden
          font-medium tracking-wide
          transition-all duration-300
          shadow-[0_0_18px_rgba(0,0,0,0.35)]
          animate-pulse
          hover:scale-105
          hover:shadow-[0_0_30px_rgba(0,0,0,0.55)]
          before:absolute
          before:inset-0
          before:bg-gradient-to-r
          before:from-transparent
          before:via-white/25
          before:to-transparent
          before:animate-[shine_2.5s_linear_infinite]
        "
      >
        <span className="relative z-10">
          Calling All Models
        </span>
      </button>

      {/* Modal */}
      {open && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
         <div className="relative w-full max-w-4xl bg-[#FFF7FF] overflow-hidden shadow-2xl animate-[fadeIn_.3s_ease] grid grid-cols-1 md:grid-cols-2">

           {/* LEFT SIDE — MODEL IMAGE */}
           <div className="relative h-[300px] md:h-auto">
             <img
               src={ CallModels }
               alt="Guntino Glam Model"
               className="w-full h-full object-cover"
             />

             {/* Optional overlay */}
             <div className="absolute inset-0 bg-black/10" />

             {/* Text overlay */}
             <div className="absolute bottom-6 left-6 text-white">
               <h4 className="uppercase tracking-[0.3em] text-xs mb-2">
                 Guntino Glam
               </h4>
             </div>
           </div>

           {/* RIGHT SIDE — CONTENT */}
           <div className="relative p-8 sm:p-10 flex flex-col justify-center">

             {/* Close */}
             <button
               onClick={() => setOpen(false)}
               className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
             >
               <FiX className="w-6 h-6" />
             </button>

             <p className="text-pink-500 uppercase tracking-[0.3em] text-xs font-medium mb-3">
               Model Applications
             </p>

             <h2 className="text-4xl font-playfair text-black mb-5 leading-tight">
               Become the Face of Our Next Collection
             </h2>

             <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
               Join Guntino Glam as a model and be part of our creative fashion campaigns and photoshoots. We’re looking for confident, stylish individuals who love fashion and representing elegance.
             </p>

             {/* Buttons */}
             <div className="space-y-4">
               <a
                 href="https://wa.me/254793904535?text=Hello%20Guntino%20Glam,%20I%20am%20interested%20in%20modeling%20for%20your%20next%20collection."
                 target="_blank"
                 rel="noopener noreferrer"
                 className="
                   w-full flex items-center justify-center gap-3
                   bg-[#25D366]
                   hover:bg-[#1ebe5d]
                   text-white
                   py-2 md:py-3
                   font-medium
                   transition-all duration-300
                 "
               >
                 <FaWhatsapp className="w-5 h-5" />
                 Apply via WhatsApp
               </a>

               <a
                 href="mailto:artbynajmaa@gmail.com?subject=Model%20Application"
                 className="
                   w-full flex items-center justify-center gap-3
                   bg-black
                   hover:bg-gray-900
                   text-white
                   py-2 md:py-3
                   font-medium
                   transition-all duration-300
                 "
               >
                 <FiMail className="w-5 h-5" />
                 Apply via Email
               </a>
             </div>
           </div>
         </div>
       </div>
     )}

      {/* Shine animation */}
      <style>{`
        @keyframes shine {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(150%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}

export default ModelsButton