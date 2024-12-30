import { Calendar } from "@/components/Calendar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner"; // Ensure correct path for Toaster

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Calendar />
      </main>
      <Footer />
      <Toaster />
      {/* Make sure 'Toaster' is directly from the library or properly exported */}
    </div>
  );
}

export default App;
