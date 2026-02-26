import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("namma-madurai-welcomed");
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("namma-madurai-welcomed", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md border-2 border-primary/20">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Welcome to Clean Madurai</DialogTitle>
          <DialogDescription className="mt-3 text-base leading-relaxed">
            Vanakkam! Welcome to Clean Madurai.
            <br />
            Let's work together to make our temple city cleaner and smarter.
            <br />
            <span className="mt-2 inline-block text-sm text-muted-foreground">
              Just one small action from you can make a big difference… Seri ah? 😉
            </span>
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleClose} className="mt-2 w-full" size="lg">
          Let's Get Started
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
