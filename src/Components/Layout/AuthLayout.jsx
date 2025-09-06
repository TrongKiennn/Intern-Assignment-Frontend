export default function AuthLayout({ children }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      {children}
    </div>
  );
}
