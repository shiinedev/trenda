"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, Menu, Sparkles, User2, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { toast } from "sonner"
import { redirect, usePathname } from "next/navigation"
import { Skeleton } from "../ui/skeleton"
import { useCartStore } from "@/app/hooks/useCart"
import ToggleTheme from "../ToggleTheme"

export function Navigation() {
  const {items} = useCartStore()

  const pathname = usePathname();

  const { data: session , isPending } = useSession();

  const handleLogout = async () =>{
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("user logout");
          redirect("/login")
        },
        onError: (ctx) => {
          console.log("error", ctx.error.message);
          toast.error("error logout in  user", {
            description: ctx.error.message
          })
        }
      }
    })
  }


  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trenda
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className={`text-md font-medium ${pathname == "/" ? "text-purple-600" :"text-foreground"}  hover:text-purple-600 transition-colors`}>
              Home
            </Link>
          <Link href="/products" className={`text-md font-medium ${pathname == "/products" ? "text-purple-600" :"text-foreground"}  hover:text-purple-600 transition-colors`}>
              Products
            </Link>
    
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <ToggleTheme />
           
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-600">
                  {items.length}
                </Badge>
              </Button>
            </Link>
            {
              isPending 
              ?
              <Skeleton className="h-10 w-10 rounded-full" />
            :
            session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback><User2 /></AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger >
                <DropdownMenuContent className="w-56">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      {session.user?.image && <AvatarImage src={session.user?.image} alt={session.user?.name} />}
                      <AvatarFallback className="rounded-lg"><User2 /></AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{session.user?.name}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {session.user?.email}
                      </span>
                    </div>
                  </div>
                 <DropdownMenuSeparator />
                  {/* <DropdownMenuItem asChild>
                     <Link href="/profile">Profile</Link> 
                  </DropdownMenuItem> */}
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button variant={"destructive"}
                     onClick={handleLogout}
                     className="w-full cursor-pointer"
                     >
                    Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            )
              :
              <div className="space-x-4">
                  <Link href="/login">
                <Button variant="outline" >
                  <User className="h-4 w-4" />
                  Login
                </Button>
               
              </Link>
              <Link href="/login">
                <Button  >
                  <User className="h-4 w-4" />
                  Get Start
                </Button>
               
              </Link>
              </div>
            
              
              }

          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Trenda
                    </span>
                  </Link>
                </div>
                {
                  session?.user && (
                    <div className="space-y-2 border-b pb-2 ">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      {session.user?.image && <AvatarImage src={session.user?.image} alt={session.user?.name} />}
                      <AvatarFallback className="rounded-lg"><User2 /></AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{session.user?.name}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {session.user?.email}
                      </span>
                    </div>
                  </div>
                  <Link href="/dashboard">
                  <Button className="w-full">
                    Go to Dashboard
                  </Button>
                  </Link>
                  </div>
                  )
                }
                {/* Mobile Navigation Links */}
                <div className="px-4">
                <Link
                    href="/"
                    className="flex items-center text-lg font-medium text-foreground hover:text-purple-600 transition-colors py-3 border-b border-accent"
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="flex items-center text-lg font-medium text-foreground hover:text-purple-600 transition-colors py-3 border-b border-accent"
                  >
                    Products
                  </Link>
                  <Link
                    href="/categories"
                    className="flex items-center text-lg font-medium text-foreground hover:text-purple-600 transition-colors py-3 border-b border-accent"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center justify-between text-lg font-medium text-foreground hover:text-purple-600 transition-colors py-3 border-b border-slate-100"
                  >
                    <span>Shopping Cart</span>
                    <Badge >3</Badge>
                  </Link>
                </div>

                {/* Mobile Footer */}
                {
                  session?.user ?
                 
                    <Button variant={"destructive"} onClick={handleLogout} className="w-full h-10 rounded-xl">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  :
                  <div className="p-2 border-t flex flex-col space-y-4">
                  <Link href="/auth/login">
                    <Button variant={"outline"} className="w-full h-12 rounded-xl">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full h-12 rounded-xl">
                      <User className="h-4 w-4 mr-2" />
                      Get Start
                    </Button>
                  </Link>
                </div>
                }
                
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}



