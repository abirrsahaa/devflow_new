'use client';

import React, { useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { QuestionSchema } from '@/lib/validations';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '@/context/ThemeProvider';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { createQuestion, editQuestion } from '@/lib/actions/question.action';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

// lets try out first implement karte hai dekhte hai kya hota hai
// lets figure out what is happening here

// need to form the schema for form zod validations

// title
// question body
// tags

// need to

interface Props {
  type?: string;
  mongoUserId: string;
  questionDetails?: string;
}

// for editor

const Questions = ({ type, mongoUserId, questionDetails }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setisSubmitting] = useState(false);
  const { mode } = useTheme();
  const router = useRouter();
  const editorRef = useRef(null);

  // !! i am in doubt of the below lines so need to fugure out what these are about
  const parsedQuestionDetails =
    questionDetails && JSON.parse(questionDetails || '');

  const groupedTags = parsedQuestionDetails?.tags.map((tag: any) => tag.name);
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || '',
      explanation: parsedQuestionDetails?.content || '',
      tags: groupedTags || [],
    },
  });

  // simple si bat hai mujhe user chahiye
  // uske liye mujhe uska clerk id chahiye jo ki mai auth se nikal lunga
  // then mai db call karunga to get this user

  // abhi db call maro with this user id
  // this means i need to set up an action for the same which would be user.actions

  // lets focus on some functionalities which will bring things to live

  // lets come to the most important part the submit handler
  // how will it react for the two types of operation
  // one for the posting of answer and other for the editing of question already asked

  // need to optimize this submit function more such that we can reuse it again and again

  const onSubmit = async (values: z.infer<typeof QuestionSchema>) => {
    // this is the main place where we will be getting the form data
    // and obviously this is the place where we will be doing the backend stuff
    // and the data handling part

    // !!edit wala sachme samajhna hoga time lagakar

    console.log(' i am fucking here ');

    setisSubmitting(true);
    console.log('the mongoid in submit is ->', mongoUserId);
    try {
      if (type === 'Edit') {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        });

        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });

        router.push('/');
      }
    } catch (error) {
      console.log('the error is in submitting the form', error);
    } finally {
      setisSubmitting(false);
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    // ab idhar kya karna hai
    // idhar mereko e se tag ka value milega
    // usko pehle trim karna hai
    // then check karna hai ke already to koi asi tag exist nahi karti na is array mai
    // and then accordingly usko insert karne ka sochna hai
    // and then field ko clear bhi karna hai for more
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters.',
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue]);
          tagInput.value = '';
          form.clearErrors('tags');
        } else {
          form.setError('tags', {
            type: 'duplicate',
            message: 'Tag already exists.',
          });
          tagInput.value = '';
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);

    form.setValue('tags', newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{' '}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                    ],
                    toolbar:
                      'undo redo | ' +
                      'codesample | bold italic forecolor | alignleft aligncenter |' +
                      'alignright alignjustify | bullist numlist',
                    content_style: 'body { font-family:Inter; font-size:16px }',
                    skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: mode === 'dark' ? 'dark' : 'light',
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    disabled={type === 'Edit'}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() =>
                            type !== 'Edit'
                              ? handleTagRemove(tag, field)
                              : () => {}
                          }
                        >
                          {tag}
                          {type !== 'Edit' && (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="Close icon"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === 'Edit' ? 'Editing...' : 'Posting...'}</>
          ) : (
            <>{type === 'Edit' ? 'Edit Question' : 'Ask a Question'}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Questions;
