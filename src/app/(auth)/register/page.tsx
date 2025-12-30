
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function RegisterPage() {
  const router = useRouter()
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      // bio: "",
    },
  });

  // 2. Mutation Setup
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: {fullName: string, email: string, password: string}) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });


  const onSubmit = (data: RegisterInput) => {
    mutate({
      fullName: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-black from-gray-100 to-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="focus-visible:ring-2 focus-visible:ring-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          className="focus-visible:ring-2 focus-visible:ring-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="focus-visible:ring-2 focus-visible:ring-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tell us about yourself"
                          className="focus-visible:ring-2 focus-visible:ring-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button type="submit" className="w-full">
                    Register {isPending && <Spinner className="mr-2" />}
                  </Button>
                </motion.div>
              </motion.form>
            </Form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { registerSchema, RegisterInput } from "@/lib/validation";
// import { Button } from "@/components/ui/button";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import Link from "next/link";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// import { motion } from "framer-motion";

// export default function RegisterPage() {
//   const form = useForm<RegisterInput>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       bio: "",
//     },
//   });

//   const onSubmit = (data: RegisterInput) => {
//     console.log("Register Form Data:", data);
//     alert("Check console for form data!");
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center 
//       bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#ec4899]
//       animate-gradient px-4"
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="w-full max-w-md"
//       >
//         <Card className="shadow-xl border border-gray-700 bg-white/10 backdrop-blur-md text-white hover:shadow-2xl transition-all duration-300">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">
//               Create an account
//             </CardTitle>
//             <CardDescription className="text-center text-gray-200">
//               Enter your details below to create your account
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <Form {...form}>
//               <motion.form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.1, duration: 0.5 }}
//               >
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-white">Name</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="John Doe"
//                           className="focus-visible:ring-2 focus-visible:ring-white transition-all bg-white/20 text-white placeholder-gray-300"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-white">Email</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="john@example.com"
//                           type="email"
//                           className="focus-visible:ring-2 focus-visible:ring-white transition-all bg-white/20 text-white placeholder-gray-300"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-white">Password</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="••••••••"
//                           type="password"
//                           className="focus-visible:ring-2 focus-visible:ring-white transition-all bg-white/20 text-white placeholder-gray-300"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="bio"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-white">Bio (Optional)</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Tell us about yourself"
//                           className="focus-visible:ring-2 focus-visible:ring-white transition-all bg-white/20 text-white placeholder-gray-300"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
//                   <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
//                     Register
//                   </Button>
//                 </motion.div>
//               </motion.form>
//             </Form>

//             <p className="text-center text-sm text-gray-200 mt-4">
//               Already have an account?{" "}
//               <Link href="/login" className="text-white underline">
//                 Login
//               </Link>
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
