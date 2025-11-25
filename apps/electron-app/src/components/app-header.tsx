import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AppHeader() {
  const handleUpgradeConfirm = () => {
    window.open('https://operone.vercel.app/#pricing', '_blank')
  }

  return (
    <Header className="justify-between items-center gap-0">
      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="rounded-full font-semibold px-4 py-1.5 flex items-center gap-1.5 bg-purple-100/80 hover:bg-purple-200/90 border text-purple-700 hover:text-purple-800 text-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade to Pro
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-sm border-0">
            <AlertDialogHeader>
              <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
              <AlertDialogDescription>
                Unlock advanced features, unlimited access, and priority support.
                Would you like to view our pricing plans?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpgradeConfirm}>
                View Pricing
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </Header>
  )
}
