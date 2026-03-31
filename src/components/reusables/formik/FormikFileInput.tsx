import { Input } from '@/components/ui/input';
import { useField, useFormikContext } from 'formik';
import React, { memo } from 'react';

interface FormikFileInputProps {
  name: string;
  label: string;
  className?: string;
  accept?: string;
  required?: boolean;
}

const FormikFileInput = ({
  name,
  label,
  className,
  accept = '*',
  required,
}: FormikFileInputProps) => {
  const [field, meta] = useField<File | null>(name);
  const { setFieldValue } = useFormikContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFieldValue(name, file);
  };

  return (
    <div className="mb-5 grid w-full items-start gap-2">
      <label className="text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Input
        type="file"
        accept={accept}
        className={className}
        onChange={handleFileChange}
        onBlur={field.onBlur}
        name={field.name}
      />

      {meta.touched && meta.error && <p className="text-sm text-rose-500">{meta.error}</p>}
    </div>
  );
};

export default memo(FormikFileInput);
