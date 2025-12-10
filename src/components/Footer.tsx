export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center py-4 mt-10 text-gray-600 text-sm">
      © {currentYear} Aries Expo — All Rights Reserved.
    </footer>
  );
}
