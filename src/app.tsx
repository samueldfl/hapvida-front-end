import { Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { HomePage } from "@/pages/home"
import { NotFoundPage } from "@/pages/not-found"

function App() {
  return (  
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App

