import * as z from "zod";

// 1. 使用 Zod 定义 Response 的 schema
const ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  success: z.boolean(),
});

// 2.运行时数据检查
try {
  ResponseSchema.parse({
    id: "1",
    name: "heyi",
    success: true,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.issues);
  }
}

// 3.通过 zod 转为 ts 类型
type User = z.infer<typeof ResponseSchema>;

export const ZodDemo = () => {
    const user: User = {
        id: "1",
        name: "heyi",
        success: true,
    }
  return <div>ZodDemo</div>;
};
