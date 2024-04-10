import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import {useEffect} from "react";
import {Heading} from "@/components/Heading";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {createSearchParams, useNavigate} from "react-router-dom";

// Zod schema object, used to define a form schema for validation
const formSchema = z.object({
  q: z
      .string()
      .trim()
      .min(2, {message: "Enter at least 2 characters"})
      .max(50, {message: "Enter no more than 50 characters."}),
})

export function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Pabulum"
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    // redirect to /search subpage with the entered text as a parameter
    navigate({
      pathname: '/search',
      search: createSearchParams(values).toString()
    });
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: ""
    }
  })

  return (
      <>
        <Menu/>
        <Main>
          <div>
            <Heading text={'Pabulum - savor the flavor, master the meal!'}/>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className={'flex gap-x-2'}>
                  {/* Search field */}
                  <FormField
                      control={form.control}
                      name={'q'}
                      render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Input className={'w-72 pt-6 pr-6 pb-6 pl-4'} placeholder={"Search for your favourite dishes..."} {...field}/>
                            </FormControl>
                          </FormItem>
                      )}
                  />
                  <Button type={'submit'} className={'p-6'}>Search</Button>
                </div>
              </form>
            </Form>
          </div>
        </Main>
      </>
  )
}
