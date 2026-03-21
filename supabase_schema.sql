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

-- 3. Storage 설정 (이미지 업로드용)
-- 'portfolio' 버킷을 대시보드에서 생성해 주세요 (Public 설정 필수)

-- Storage 정책 설정 (storage.objects 테이블에 대한 정책)
-- 1. 누구나 이미지 조회 가능
CREATE POLICY "Allow public read access for portfolio images" 
ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

-- 2. 누구나 업로드 가능 (문의 시 사진 첨부용)
CREATE POLICY "Allow public to upload portfolio images" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');

-- 3. 인증된 사용자만 자기 파일 또는 버킷 내 파일 삭제 가능
CREATE POLICY "Allow authenticated users to delete portfolio images" 
ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');
