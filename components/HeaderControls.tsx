import LoginButton from "@/components/LoginButton"
import NotificationButton from "@/components/NotificationButton"
import ThemeToggle from "@/components/ThemeToggle"

export default function HeaderControls() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <LoginButton />
      <NotificationButton />
      <ThemeToggle />
    </div>
  )
}
