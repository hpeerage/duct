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
-- 'portfolio', 'hero' 버킷을 대시보드에서 생성해 주세요 (Public 설정 필수)

-- Storage 정책 설정 (storage.objects 테이블에 대한 정책)
-- 1. 누구나 이미지 조회 가능
CREATE POLICY "Allow public read access for storage images" 
ON storage.objects FOR SELECT USING (bucket_id IN ('portfolio', 'hero'));

-- 2. 누구나 업로드 가능 (문의 시 사진 첨부용)
CREATE POLICY "Allow public to upload images" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('portfolio', 'hero'));

-- 3. 인증된 사용자만 자기 파일 또는 버킷 내 파일 삭제 가능
CREATE POLICY "Allow authenticated users to delete images" 
ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('portfolio', 'hero'));

-- 4. Hero 페이지 관리 테이블 (Hero Content)
CREATE TABLE public.hero_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    badge TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- RLS 설정
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

-- 정책: 조회는 누구나 가능
CREATE POLICY "Allow public read access for hero_content" ON public.hero_content 
    FOR SELECT USING (true);

-- 정책: 관리는 인증된 관리자만 가능
CREATE POLICY "Enable all for authenticated admins on hero_content" ON public.hero_content 
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

-- 5. 방문자 로그 테이블 (Visitor Logs)
CREATE TABLE public.visitor_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id TEXT -- 세션별 유니크 방문을 위해 브라우저 세션 ID 사용 권장
);

-- RLS 설정
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- 정책: 방문 기록 등록은 누구나 가능 (Public)
CREATE POLICY "Enable insert for all users on visitor_logs" ON public.visitor_logs FOR INSERT WITH CHECK (true);

-- 정책: 방문 기록 조회는 인증된 관리자만 가능
CREATE POLICY "Enable select for authenticated admins on visitor_logs" ON public.visitor_logs 
    FOR SELECT TO authenticated USING (auth.role() = 'authenticated');
