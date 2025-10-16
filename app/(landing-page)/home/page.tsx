import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/ui/user-menu";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { BiasInput } from "./_components/bias-input";

export default async function HomePage() {
  const user = await getCurrentUser();

  const placeholders = [
    "Women are naturally bad at math.",
    "All programmers are introverts who don't like socializing.",
    "Older people can't learn new technologies.",
    "If someone is rich, they must be greedy.",
    "Men are better leaders than women.",
    "People who don't go to college aren't intelligent.",
    "All teenagers are lazy and irresponsible.",
    "Immigrants take jobs away from locals.",
    "People from rural areas aren't ambitious.",
    "Athletes aren't as smart as academics.",
  ];

  return (
    <div className="p-4 bg-black text-white min-h-screen relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-row items-center justify-between space-y-2 gap-2">
          <div className="flex flex-row items-center space-x-2">
            <GalleryVerticalEnd
              size={10}
              color="white"
              className="h-12 w-12 !text-white"
            />
            <p className="font-bold !text-white">
              AI-BRIDGE{" "}
              <span className="md:block hidden">Bias Detection System</span>
            </p>
          </div>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Link href={"/login"}>
              <Button>Sign In</Button>
            </Link>
          )}
        </div>

        <div className="min-h-[40vh] md:pt-60 pt-20">
          <h2 className="my-4 text-3xl text-center sm:text-5xl text-white">
            Analyze your sentence for bias
          </h2>
          <BiasInput placeholders={placeholders} />
        </div>
      </div>

      <footer className="md:block hidden absolute bottom-0 w-full text-center p-4 border-t border-white/10 text-sm text-white/50">
        Powered by StudyLabs
      </footer>
    </div>
  );
}
