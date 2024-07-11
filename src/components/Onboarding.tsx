/* eslint-disable @next/next/no-img-element */
import useEmblaCarousel from "embla-carousel-react";
import { Page } from "./Page";
import logo from "@/assets/logo.png";
import onboarding from "@/assets/onboarding-1.png";
import onboarding2 from "@/assets/onboarding-2.png";
import { useCallback, useEffect, useState } from "react";
import {
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconLoader,
  IconLock,
} from "@tabler/icons-react";
import { Button } from "./Button";
import { useBrowser } from "@/hooks/useBrowser";
import { useSetPreference } from "@/hooks/usePreferences";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { DO_TOKEN_KEY, DO_ACCOUNTS } from "@/utils/const";
import { getAccount } from "@/hooks/useAccount";
import { IAccount } from "dots-wrapper/dist/account";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useDisclosure } from "@mantine/hooks";

const SetupSchema = z.object({
  token: z
    .string({ required_error: "A token is required to continue" })
    .min(1, "A token is required to continue"),
});

const MotionBtn = motion(Button);
const wrapper = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const item = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.5,
      ease: "easeInOut",
    },
  },
  hidden: { opacity: 0, y: 100 },
};

export function Onboarding() {
  const navigate = useBrowser();
  const [isVisible, setIsVisible] = useState(false);
  const [isPasswordVisible, { toggle }] = useDisclosure(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    draggable: false,
    speed: 20,
  });
  const [account, setAccount] = useState<IAccount>();

  const setPreference = useSetPreference();

  const { getInputProps, onSubmit, ...form } = useForm({
    validate: zodResolver(SetupSchema),
    initialValues: {
      token: "",
    },
  });

  const handleSubmit = async ({ token }: z.infer<typeof SetupSchema>) => {
    try {
      const data = await getAccount({ token });
      setAccount(data);

      setTimeout(() => {
        setPreference.mutate({
          key: DO_TOKEN_KEY,
          value: token,
        });
        setPreference.mutate({
          key: DO_ACCOUNTS,
          value: {
            // @ts-expect-error: Wrong types in package
            [data.team.uuid]: {
              ...data,
              token,
            },
          },
        });
      }, 2000);
    } catch (error) {
      toast.error("Something went wrong");
      return;
    }
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 1000);
  }, []);

  return (
    <Page withSidebar={false}>
      <Page.Content>
        <div className="relative overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {/* slide */}
            <div className="h-full min-w-0 flex-grow-0 flex-shrink-0 basis-full bg-ocean text-white px-safe">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={wrapper}
                className="relative h-full w-full flex flex-col items-center justify-center px-4 container max-w-sm mx-auto"
              >
                <motion.h1
                  className="text-4xl font-black text-center"
                  variants={item}
                >
                  Welcome to{" "}
                  <span className="block bg-white rounded-md text-ocean px-2">
                    Mission Control
                  </span>
                </motion.h1>
                <motion.img
                  src={onboarding.src}
                  alt=""
                  className="w-full max-w-xs"
                  variants={item}
                />
                <motion.p variants={item} className="text-center text-xl mb-4">
                  Get the most out of your DigitalOcean resources on the go.
                </motion.p>
                <MotionBtn variants={item} onClick={scrollNext} variant="light">
                  Get Started
                </MotionBtn>
              </motion.div>
            </div>

            {/* slide */}
            <div className="h-full min-w-0 flex-grow-0 flex-shrink-0 basis-full text-ocean bg-white px-safe">
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={wrapper}
                className="relative h-full w-full flex flex-col items-center justify-center px-4 container max-w-sm mx-auto"
              >
                <motion.p variants={item} className="text-xl mb-8 text-center">
                  Take control of your resources from the palm of your hand.
                </motion.p>
                <motion.ul
                  initial="hidden"
                  whileInView="visible"
                  variants={wrapper}
                  className="mb-8"
                >
                  <motion.li
                    variants={item}
                    className="text-2xl font-black text-center"
                  >
                    Apps Platform
                  </motion.li>
                  <motion.li
                    variants={item}
                    className="text-2xl font-black text-center"
                  >
                    Billing
                  </motion.li>
                  <motion.li
                    variants={item}
                    className="text-2xl font-black text-center"
                  >
                    Droplets
                  </motion.li>
                  <motion.li
                    variants={item}
                    className="text-2xl font-black text-center"
                  >
                    Managed Databases
                  </motion.li>
                  <motion.li
                    variants={item}
                    className="text-2xl font-black text-center"
                  >
                    Networking
                  </motion.li>
                  <motion.li
                    variants={item}
                    className="text-2xl font-black text-center"
                  >
                    and more...
                  </motion.li>
                </motion.ul>

                <motion.div
                  variants={item}
                  className="flex justify-center mb-52"
                >
                  <Button onClick={scrollNext}>Get Started</Button>
                </motion.div>

                <motion.div
                  initial={{
                    y: -200,
                    opacity: 0.5,
                  }}
                  whileInView={{
                    y: 150,
                    opacity: 1,
                  }}
                  className="absolute bottom-0 inset-x-0 flex items-end justify-center"
                >
                  <img
                    src={onboarding2.src}
                    alt=""
                    className="w-full max-w-xs"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* slide */}
            <div className="h-full min-w-0 flex-grow-0 flex-shrink-0 basis-full bg-ocean text-white">
              <div className="relative h-full w-full flex flex-col items-center justify-center px-4 container max-w-sm mx-auto">
                {account ? (
                  <div className="animate-slideUp">
                    <h1 className="text-2xl font-black mb-4">
                      Welcome,
                      <br />
                      {account.email}!
                    </h1>
                    <div className="flex items-center">
                      <IconLoader
                        className="animate-spin flex-shrink-0 mr-4"
                        size={32}
                      />
                      <p className="text-lg">
                        One minute while we load your resources.
                      </p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={wrapper}
                  >
                    <motion.div className="mb-6" variants={item}>
                      <h1 className="text-4xl font-black mb-4">Almost Done</h1>
                      <p className="text-xl">
                        To get started, get your personal access token from{" "}
                        <span
                          className="font-bold underline"
                          onClick={() =>
                            navigate(
                              "https://cloud.digitalocean.com/account/api/tokens"
                            )
                          }
                        >
                          here
                        </span>
                        . If you have not created one, click on &quot;Generate
                        New Token&quot;. When copied, paste it below to
                        continue.
                      </p>
                      <div className="bg-white rounded-lg p-4 text-ocean mt-4 relative">
                        <p className="text-base border-l-2 border-ocean pl-2">
                          Your token will never be used by anyone other than you
                          and is 100% stored on your device.
                        </p>
                      </div>
                    </motion.div>

                    <motion.form
                      variants={item}
                      method="post"
                      onSubmit={onSubmit(handleSubmit)}
                    >
                      <div className="w-full mb-4">
                        <label className="block font-medium text-indigo-200">
                          Token
                        </label>
                        <div className="relative mt-1">
                          <span className="absolute h-full w-10 flex items-center justify-center">
                            <IconLock size={16} className="text-indigo-800" />
                          </span>
                          <div className="relative">
                            <input
                              type={isPasswordVisible ? "text" : "password"}
                              name="token"
                              className="bg-white h-10 pr-9 rounded-md w-full text-indigo-800"
                              placeholder="dop_v1_e...."
                              {...getInputProps("token")}
                            />
                            <span className="absolute right-0 aspect-square inset-y-0 h-full flex items-center justify-center p-1">
                              <button
                                onClick={toggle}
                                type="button"
                                className="border border-ocean-2 rounded-md h-full w-full flex items-center justify-center bg-white"
                              >
                                {isPasswordVisible ? (
                                  <IconEye size={16} className="text-black" />
                                ) : (
                                  <IconEyeOff
                                    size={16}
                                    className="text-black"
                                  />
                                )}
                              </button>
                            </span>
                          </div>
                        </div>
                        {form.errors.token && (
                          <span className="italic text-red-300">
                            {form.errors.token}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="light"
                        loading={setPreference.isLoading}
                        rightIcon={
                          <IconArrowRight size={16} className="ml-2" />
                        }
                      >
                        <span>Save and Continue</span>
                      </Button>
                    </motion.form>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* logo */}
          <img
            src={logo.src}
            alt=""
            className="h-12 w-12 absolute top-4 left-1/2 transform -translate-x-1/2 mt-safe"
          />
        </div>
      </Page.Content>
    </Page>
  );
}
