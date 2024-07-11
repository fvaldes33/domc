import { useForm, zodResolver } from "@mantine/form";
import { IDomainRecord } from "dots-wrapper/dist/domain";
import React, { useMemo } from "react";
import { z } from "zod";

interface FieldLayout {
  label: string;
  key: keyof IDomainRecord;
  placeholder: string;
  className?: string;
  props: {
    [k: string]: string;
    type: React.HTMLInputTypeAttribute;
  };
}

const DU = z.discriminatedUnion("type", [
  z.object({ type: z.literal("A") }),
  z.object({ type: z.literal("AAAA") }),
  z.object({ type: z.literal("CNAME"), ttl: z.number().default(43200) }),
  z.object({ type: z.literal("NS"), ttl: z.number().default(86400) }),
  z.object({ type: z.literal("MX"), priority: z.number() }),
  z.object({
    type: z.literal("SRV"),
    priority: z.number(),
    port: z.number(),
    weight: z.number(),
    ttl: z.number().default(43200),
  }),
  z.object({
    type: z.literal("TXT"),
    ttl: z.number().default(3600),
  }),
]);

const DomainRecordSchema = z
  .object({
    name: z.string({ required_error: "Required" }).min(1, "Required"),
    data: z.string().min(1, "Required"),
    ttl: z.number().default(3600),
  })
  .and(DU);

const FieldMap: { [key: string]: FieldLayout[] } = {
  CNAME: [
    {
      props: { type: "text" },
      label: "Hostname",
      key: "name",
      placeholder: "Enter hostname",
    },
    {
      props: { type: "text" },
      label: "Is an alias of",
      key: "data",
      placeholder: "Enter @ or hostname",
    },
    {
      props: {
        type: "number",
        min: "300",
        inputMode: "numeric",
      },
      label: "TTL",
      key: "ttl",
      placeholder: "3600",
    },
  ],
  A: [
    {
      props: { type: "text" },
      label: "Hostname",
      key: "name",
      placeholder: "Enter @ or hostname",
    },
    {
      props: { type: "text" },
      label: "Directs To",
      key: "data",
      placeholder: "Enter IP address",
    },
    {
      props: {
        type: "number",
        min: "300",
        inputMode: "numeric",
      },
      label: "TTL",
      key: "ttl",
      placeholder: "3600",
    },
  ],
  AAAA: [
    {
      props: { type: "text" },
      label: "Hostname",
      key: "name",
      placeholder: "Enter @ or hostname",
    },
    {
      props: { type: "text" },
      label: "Directs To",
      key: "data",
      placeholder: "Enter IPv6 address",
    },
    {
      props: { type: "number", min: "300", inputMode: "numeric" },
      label: "TTL",
      key: "ttl",
      placeholder: "3600",
    },
  ],
  MX: [
    {
      props: { type: "text" },
      label: "Hostname",
      key: "name",
      placeholder: "Enter @ or hostname",
    },
    {
      props: { type: "text" },
      label: "Mail Server",
      key: "data",
      placeholder: "e.g. aspmx.l.google.com",
    },
    {
      props: { type: "text" },
      label: "Priority",
      key: "priority",
      placeholder: "e.g. 10",
    },
    {
      props: { type: "number", min: "300", inputMode: "numeric" },
      label: "TTL",
      key: "ttl",
      placeholder: "3600",
    },
  ],
  TXT: [
    {
      props: { type: "text" },
      label: "Value",
      key: "data",
      placeholder: "Paste TXT value here",
    },
    {
      props: { type: "text" },
      label: "Hostname",
      key: "name",
      placeholder: "Enter @ or hostname",
    },
    {
      props: { type: "number", min: "300", inputMode: "numeric" },
      label: "TTL",
      key: "ttl",
      placeholder: "3600",
    },
  ],
  NS: [
    {
      props: { type: "text" },
      label: "Hostname",
      key: "name",
      placeholder: "Enter @ or hostname",
    },
    {
      props: { type: "text" },
      label: "Directs To",
      key: "data",
      placeholder: "Enter IP address",
    },
    {
      props: { type: "number", min: "300", inputMode: "numeric" },
      label: "TTL",
      key: "ttl",
      placeholder: "3600",
    },
  ],
  SRV: [
    {
      props: { type: "text" },
      label: "Hostname",
      key: "name",
      placeholder: "Enter @ or hostname",
    },
    {
      props: { type: "text" },
      label: "Directs To",
      key: "data",
      placeholder: "Enter IP address",
    },
    {
      props: { type: "text" },
      label: "Port",
      key: "port",
      placeholder: "e.g. 5500",
    },
    {
      props: { type: "text" },
      label: "Priority",
      key: "priority",
      placeholder: "e.g. 10",
    },
    {
      props: { type: "text" },
      label: "Weight",
      key: "weight",
      placeholder: "e.g. 100",
    },
    {
      props: { type: "number", min: "300", inputMode: "numeric" },
      label: "TTL",
      key: "ttl",
      placeholder: "3600",
    },
  ],
};

type IDomainRecordForm = z.infer<typeof DomainRecordSchema>;

const DomainRecordStub: Omit<IDomainRecord, "id"> = {
  type: "CNAME",
  data: "",
  ttl: 3600,
  flags: 0,
  port: 0,
  priority: 0,
  name: "",
  tag: "",
  weight: 0,
};
export function DomainRecordForm({
  record,
  onSave,
}: {
  record?: IDomainRecord;
  onSave: (record: IDomainRecord) => void;
}) {
  const { getInputProps, onSubmit, ...form } = useForm<IDomainRecordForm>({
    validate: zodResolver(DomainRecordSchema),
    initialValues: {
      ...((record as IDomainRecordForm) ?? DomainRecordStub),
    },
  });

  const fieldMapFields = useMemo(() => {
    return FieldMap[form.values.type] ?? [];
  }, [form.values.type]);

  const handleSubmit = (values: typeof form.values) => {
    const cleanValues = Object.keys(values).reduce((acc, key) => {
      return {
        ...acc,
        [key]: Boolean(values[key as keyof typeof values])
          ? values[key as keyof typeof values]
          : null,
      };
    }, values);

    onSave({
      ...(cleanValues as IDomainRecord),
      data:
        !cleanValues.data.endsWith(".") && cleanValues.type === "CNAME"
          ? `${cleanValues.data}.`
          : cleanValues.data,
    });
  };

  return (
    <form id="recordForm" className="px-4" onSubmit={onSubmit(handleSubmit)}>
      {!record && (
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-black dark:text-white"
          >
            Type
          </label>
          <select
            className="disabled:opacity-75 disabled:bg-gray-200 mt-1 block w-full dark:text-black rounded-md border border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
            {...getInputProps("type")}
          >
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
            <option value="NS">NS</option>
            <option value="MX">MX</option>
            <option value="SRV">SRV</option>
            <option value="TXT">TXT</option>
          </select>
        </div>
      )}
      {fieldMapFields.map((field) => {
        const formProps =
          field.props.type === "number"
            ? {
                ...field.props,
                ...getInputProps(field.key),
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNaN(e.target.valueAsNumber)) {
                    e.preventDefault();
                    form.setFieldValue(field.key, 0);
                  } else {
                    form.setFieldValue(field.key, e.target.valueAsNumber);
                  }
                },
              }
            : {
                ...field.props,
                ...getInputProps(field.key),
              };
        return (
          <div className="mb-4" key={field.key}>
            <label
              htmlFor={field.key}
              className="block text-sm font-medium text-black dark:text-white"
            >
              {field.label}
            </label>
            <input
              name={field.key}
              id={field.key}
              autoComplete="none"
              autoCapitalize="off"
              autoCorrect="false"
              spellCheck="false"
              className="disabled:opacity-75 disabled:bg-gray-200 mt-1 block w-full dark:text-black rounded-md border border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
              {...formProps}
            />
            {field.key in form.errors && (
              <span className="text-sm text-red-600">
                {form.errors[field.key]}
              </span>
            )}
          </div>
        );
      })}
    </form>
  );
}
