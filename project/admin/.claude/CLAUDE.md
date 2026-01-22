관리자 페이지(Admin Dashboard)는 **데이터 무결성**, **보안(권한 관리)**, 그리고 **대량 데이터 처리**가 핵심입니다. 기존 사용자 앱과는 다르게 **폼 처리(Form Handling)**와 **테이블(Table)** 구현에 중점을 둔 `CLAUDE.md`입니다.

이 내용을 프로젝트 루트의 `CLAUDE.md`에 추가하거나, 관리자 기능 개발 시 참고할 수 있도록 별도로 저장하세요.

````markdown
# Admin Dashboard Context (Coloring App)

## Project Overview

Admin interface for the Digital Coloring App to manage templates, categories, and view analytics. Built within the existing Next.js 14 application under `/admin` routes. Focus on efficiency, data integrity, and strict security.

## Critical Rules

### 1. Security & Permissions (Zero Trust)

- **Role Verification:** ALL `/admin` routes and API endpoints must verify `user_roles.role === 'admin'`.
- **Middleware:** Use Next.js Middleware to redirect non-admins immediately.
- **RLS:** Ensure Supabase Row Level Security policies explicitly allow 'admin' role for all operations.

### 2. Data Integrity

- **Soft Deletes:** Never `DELETE` rows from the database. Use `is_deleted` boolean flag.
- **Validation:** Strict server-side validation using Zod for all inputs.
- **Transactions:** Use Supabase RPC or careful sequencing when updating related tables (e.g., Template + Category stats).

### 3. Media Handling

- **Server-Side Processing:** Images must be processed via API Route (`/api/admin/upload`) using `sharp`.
- **Optimization:** Resize to max 2048px, convert to WebP (quality 90) before storage.
- **Thumbnails:** Auto-generate 400x400px thumbnails.

### 4. UI/UX Standards

- **Components:** Use `shadcn/ui` for consistency (Data Table, Dialog, Form).
- **Forms:** Use `react-hook-form` + `zod` resolver. No manual controlled inputs.
- **Feedback:** Show toast notifications for success/error states. Use loading skeletons for tables.

## File Structure

```text
src/
|-- app/
|   |-- admin/                  # Admin Routes
|   |   |-- layout.tsx          # Admin Sidebar & Auth Check
|   |   |-- page.tsx            # Dashboard Stats
|   |   |-- templates/          # Template CRUD
|   |   |-- categories/         # Category CRUD
|   |-- api/
|       |-- admin/              # Secure Admin API Routes
|           |-- upload/         # Sharp image processing
|-- components/
|   |-- admin/                  # Admin-specific components
|       |-- data-table/         # Tanstack Table wrapper
|       |-- forms/              # Reusable form parts
|-- lib/
    |-- admin-auth.ts           # Helper to verify admin role
```
````

## Key Patterns

### Admin Route Protection (Layout/Page)

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (role?.role !== 'admin') redirect('/'); // Kick out non-admins

  return <div className="admin-layout">{children}</div>;
}

```

### Form Handling (React Hook Form + Zod)

```typescript
const formSchema = z.object({
  title: z.string().min(2),
  category_id: z.string().uuid(),
  is_active: z.boolean().default(true),
});

// Inside Component
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { is_active: true },
});

async function onSubmit(values: z.infer<typeof formSchema>) {
  // Call Supabase or API
}
```

### Image Upload API (Sharp)

```typescript
// app/api/admin/upload/route.ts
// 1. Verify Admin (Strict)
// 2. Parse FormData
// 3. Process with Sharp
const buffer = await file.arrayBuffer();
const webpBuffer = await sharp(Buffer.from(buffer))
  .resize(2048, 2048, { fit: 'inside' })
  .webp({ quality: 90 })
  .toBuffer();
// 4. Upload to Supabase Storage
```

## Database Schema (Admin Extensions)

```sql
-- Existing tables extended
ALTER TABLE templates ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE templates ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- User Roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'user'))
);

```

## Dependencies to Install

- `npm install sharp` (Image processing)
- `npm install @tanstack/react-table` (Data grids)
- `npm install react-dropzone` (Drag & drop upload)
- `npm install react-hook-form @hookform/resolvers zod` (Forms)
- `npm install recharts` (Analytics - Optional)

## Git Workflow

- Admin features should be developed on `feature/admin-*` branches.
- **Migration Check:** Always check if a DB migration is required for new admin fields.

```

### 💡 Context Engineer의 조언

이 `CLAUDE.md`는 관리자 페이지 개발 시 다음과 같은 실수를 방지하도록 설계되었습니다:
1.  **보안 구멍:** `Critical Rules 1번`을 통해 프론트엔드와 백엔드 양쪽에서 Admin 권한을 체크하도록 강제합니다.
2.  **데이터 유실:** `Soft Deletes` 규칙을 통해 실수로 템플릿을 영구 삭제하는 것을 막습니다.
3.  **이미지 성능 저하:** 사용자 앱에서 로딩 속도가 느려지지 않도록, 업로드 시점(`api/admin/upload`)에 이미지를 최적화(WebP, Resizing)하도록 명시했습니다.

**다음 단계:**
"관리자 페이지 개발을 위해 `sharp`와 `react-dropzone`을 설치하고, 이미지 업로드 API 라우트(`app/api/admin/upload/route.ts`)의 초안을 작성해줘"라고 요청해보세요.

```
