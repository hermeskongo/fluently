
export default function AuthLayout({children}) {
  return ( 
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-6" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row rounded-xl shadow-lg w-full max-w-5xl overflow-hidden mx-auto bg-base-100">

        {/* LEFT PART */}
        <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-8">
            {children}
        </div>
        {/* RIGHT PART */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/video.png" alt="SignUpPage illustration" />
            </div>
            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect with language partner Worlwide</h2>
              <p className="opacity-70 text-sm">Pratice conversations, make friends and improve you language skills together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
