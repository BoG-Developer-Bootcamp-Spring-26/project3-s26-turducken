export default function Footer() {
  return (
    <>
    <div className="absolute bottom-0 left-0 z-0 pointer-events-none">
    <img 
        src="images/quarterCircle.png"
        alt='Quarter Circle'
        className='size-50'
    />
    </div>

    <footer className="w-full text-center text-[10px] text-gray-500 pb-4 z-10">
        <p>Made with ♡ by Turducken Team</p>
        <p>© 2026 BGD, Developer Bootcamp. All rights reserved.</p>
    </footer>
    </>
  );
}