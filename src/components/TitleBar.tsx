export default function TitleBar() {
  return (
    <div className="flex items-center gap-1 w-full shadow-sm">
      <img 
        src="/images/appLogo.png"
        alt="App Logo"
        className="h-10 w-16 mt-5 mb-5 ml-5"
      />
      <p className="text-4xl font-medium font-oswald tracking-tight text-black">Progress</p>
    </div>
  );
}