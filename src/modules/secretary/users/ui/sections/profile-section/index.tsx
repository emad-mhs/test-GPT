'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowRightIcon, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';

import { paths } from '@/lib/paths';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { uploadAvatar } from '@/lib/storage';
import { ProfileSectionSkeleton } from './skeleton';
import { ProfileUpdateInput, profileUpdateSchema } from '../../../schema';
import { Toast } from '@/lib/toast';
import { ErrorFallback } from '@/components/error-fallback';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';
import { useDepartmentsOptions } from '@/hooks/use-options';

interface ProfileSectionProps {
  userId: string;
}

export const ProfileSection = ({ userId }: ProfileSectionProps) => {
  return (
    <Suspense fallback={<ProfileSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ProfileSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProfileSectionSuspense = ({ userId }: ProfileSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: user } = useSuspenseQuery(
    trpc.users.getOne.queryOptions({ userId })
  );

  const departmentOpts = useDepartmentsOptions();
  // const { data: departments } = useSuspenseQuery(
  //   trpc.departments.getAll.queryOptions()
  // );

  // const [{ data: departments }] = trpc.departments.getAll.useSuspenseQuery();

  // const departmentOptions = departments.map(department => ({
  //   value: department.id.toString(),
  //   label: department.name,
  // }));

  const updateUser = useMutation(
    trpc.users.profile.mutationOptions({
      onSuccess: () => {
        Toast.success('تم تعديل الملف الشخصي');
        queryClient.invalidateQueries(trpc.users.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.users.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(
          trpc.users.getOne.queryOptions({ userId })
        );
        form.setValue('password', '');
        form.setValue('newPassword', '');
        form.setValue('confirmPassword', '');
        router.push(paths.usersPage());
      },
      onError: err => {
        Toast.error(err.message);
      },
    })
  );

  const isPending = updateUser.isPending || isSubmitting;
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('imageUrl', file);
    }
  };

  const onSubmit = async (values: ProfileUpdateInput) => {
    setIsSubmitting(true);

    let uploadedImageUrl = user.imageUrl || undefined;

    if (values.imageUrl instanceof File) {
      uploadedImageUrl = await uploadAvatar({
        image: values.imageUrl,
        name: values.name,
      });
    }

    setIsSubmitting(false);

    updateUser.mutate({
      ...values,
      imageUrl: uploadedImageUrl,
    });
  };

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      id: userId,
      name: user.name,
      email: user.email,
      departmentId: user.departmentId,
      isTwoFactorEnabled: user.isTwoFactorEnabled as boolean,
      imageUrl: user.imageUrl as string,
      password: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    },
  });

  const newPasswordValue = form.watch('newPassword');

  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardHeader className='flex flex-row items-center gap-x-4'>
        <Button size='sm' variant='muted' onClick={() => router.back()}>
          <ArrowRightIcon className='size-4' />
          عودة
        </Button>
        <CardTitle className='text-xl font-bold'>
          تعديل بيانات المستخدم
        </CardTitle>
      </CardHeader>
      <div className='px-7'>
        <Separator />
      </div>
      <CardContent className='px-7'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-y-4'>
              <FormField
                control={form.control}
                name='imageUrl'
                render={({ field }) => (
                  <div className='flex flex-col gap-y-2'>
                    <div className='flex items-center gap-x-5'>
                      {field.value ? (
                        <div className='size-[72px] relative rounded-md overflow-hidden'>
                          <Image
                            alt='Logo'
                            fill
                            className='object-cover'
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                          />
                        </div>
                      ) : (
                        <Avatar className='size-[72px]'>
                          <AvatarFallback>
                            <ImageIcon className='size-[36px] text-neutral-400' />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className='flex flex-col'>
                        <p className='text-sm'>الصورة الشخصية</p>
                        <p className='text-sm text-muted-foreground'>
                          JPG, PNG, SVG or JPEG, الحجم الأقصى 1 ميجا
                        </p>
                        <input
                          className='hidden'
                          type='file'
                          accept='.jpg, .png, .jpeg, .svg'
                          ref={inputRef}
                          onChange={handleImageChange}
                          disabled={isPending}
                        />
                        {field.value ? (
                          <div className='flex flex-row  space-x-2 space-x-reverse'>
                            {field.value && (
                              <Button
                                type='button'
                                disabled={isPending}
                                variant='destructive'
                                size='sm'
                                className='w-fit mt-2'
                                onClick={() => {
                                  field.onChange(null);
                                  if (inputRef.current) {
                                    inputRef.current.value = '';
                                  }
                                }}
                              >
                                حذف الصورة
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            type='button'
                            disabled={isPending}
                            variant='teritary'
                            size='sm'
                            className='w-fit mt-2'
                            onClick={() => inputRef.current?.click()}
                          >
                            رفع صورة
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder='عماد'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإيميل</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder='example@gmail.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور الحالية</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='******'
                        type='password'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور الجديدة</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='******'
                        type='password'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {newPasswordValue && (
                <div className='transition-all duration-300'>
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تأكيد كلمة المرور</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='******'
                            type='password'
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name='departmentId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإدارة</FormLabel>
                    <FormControl>
                      <Select
                        dir='rtl'
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={true}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='اختر اسم الإدارة' />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentOpts?.map(department => (
                            <SelectItem
                              key={department.value}
                              value={department.value}
                            >
                              {department.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isTwoFactorEnabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border border-input p-3 shadow-xs'>
                    <div className='space-y-0.5'>
                      <FormLabel>المصادقة الثنائية</FormLabel>
                      <FormDescription>
                        تفعيل التحقق بخطوتين وإرسال رمز التحقق عبر البريد
                        الالكتروني
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Separator className='my-4' />

              <div className='flex items-center justify-between'>
                <Button
                  type='button'
                  size='lg'
                  variant='secondary'
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  إلغاء
                </Button>
                <Button disabled={isPending} type='submit' size='lg'>
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
