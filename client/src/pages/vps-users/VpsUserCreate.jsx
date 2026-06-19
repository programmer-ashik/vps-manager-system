import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateVpsUserMutation } from "../../api/vpsUserApi";
import { useGetVpsServersQuery } from "../../api/vpsServerApi";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/common/useToast";
import CustomSelect from "../../components/ui/CustomSelect";

const schema = z.object({
  customerName: z.string().trim().min(1, "Name is required"),
  customerEmail: z.string().trim().email("Enter a valid email"),
  customerPhone: z.string().optional(),
  vpsServerIds: z.array(z.string()).default([]),
  subscriptionPlan: z.enum(["monthly", "3_monthly", "6_monthly", "yearly"]),
  notes: z.string().optional(),
});

export default function VpsUserCreate() {
  const [createUser, { isLoading }] = useCreateVpsUserMutation();
  const { data: servers = [] } = useGetVpsServersQuery({
    availabilityStatus: "available",
  });
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      vpsServerIds: [],
      subscriptionPlan: "monthly",
      notes: "",
    },
    mode: "onChange",
  });

  const serverOptions = servers.map((s) => ({
    label: `${s.name} — ${s.ip}`,
    value: s.id,
  }));

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Add VPS User</h1>
      </div>
      <div className='border rounded-lg p-6 bg-white dark:bg-neutral-800 shadow-sm'>
        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              // এখানে values.vpsServerIds সরাসরি ব্যবহার করুন
              const body = {
                customerName: values.customerName,
                customerEmail: values.customerEmail,
                customerPhone: values.customerPhone,
                subscriptionPlan: values.subscriptionPlan,
                notes: values.notes,
                vpsServerIds: values.vpsServerIds, // এটি অবশ্যই অ্যারে হিসেবে যাবে
              };

              console.log("Payload to API:", body); // এখানে চেক করুন ডেটা আছে কি না

              const created = await createUser(body).unwrap();
              showToast("VPS user created");
              navigate(`/vps-users/${created.id}`);
            } catch (err) {
              console.error("Submission Error:", err);
              setError("root", {
                type: "server",
                message: "Failed to create VPS user",
              });
            }
          })}
          className='space-y-5'
        >
          <Input label='Customer Name' required {...register("customerName")} />
          {errors.customerName && (
            <p className='text-xs text-red-500'>
              {errors.customerName.message}
            </p>
          )}

          <Input
            label='Email'
            type='email'
            required
            {...register("customerEmail")}
          />
          {errors.customerEmail && (
            <p className='text-xs text-red-500'>
              {errors.customerEmail.message}
            </p>
          )}

          <Input label='Phone' {...register("customerPhone")} />

          <CustomSelect
            name='subscriptionPlan'
            control={control}
            label='Subscription Plan'
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "3 Monthly", value: "3_monthly" },
              { label: "6 Monthly", value: "6_monthly" },
              { label: "Yearly", value: "yearly" },
            ]}
          />

          <CustomSelect
            name='vpsServerIds'
            control={control}
            label='Assign VPS Servers'
            multi={true}
            options={serverOptions}
          />

          <div>
            <label className='block text-sm font-medium mb-1'>Notes</label>
            <textarea
              {...register("notes")}
              rows={3}
              className='w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
              placeholder='Internal notes…'
            />
          </div>

          <div className='flex flex-wrap gap-2 pt-2'>
            <Button type='submit' disabled={isLoading || !isValid}>
              {isLoading ? "Creating…" : "Create VPS User"}
            </Button>
            <Button
              type='button'
              variant='secondary'
              onClick={() => navigate("/vps-users")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
