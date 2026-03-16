-- 1. 견적 문의 테이블 (Inquiries)
CREATE TABLE public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    region TEXT NOT NULL,
    content TEXT,
    photo_url TEXT,
    status TEXT DEFAULT 'pending' NOT NULL -- pending, completed
);

-- 2. 시공 사례 테이블 (Portfolio)
CREATE TABLE public.portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    region_tag TEXT,
    is_featured BOOLEAN DEFAULT false
);

-- RLS (Row Level Security) 설정 - 관리자 전용
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- 정책: 문의 등록은 누구나 가능 (Public)
CREATE POLICY "Enable insert for all users" ON public.inquiries FOR INSERT WITH CHECK (true);

-- 정책: 문의 조회/수정은 인증된 관리자만 가능
CREATE POLICY "Enable select/update for authenticated admins only" ON public.inquiries 
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

-- 정책: 시공 사례 조회는 누구나 가능
CREATE POLICY "Allow public read access for portfolio" ON public.portfolio 
    FOR SELECT USING (true);

-- 정책: 시공 사례 관리는 인증된 관리자만 가능
CREATE POLICY "Enable all for authenticated admins on portfolio" ON public.portfolio 
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');
