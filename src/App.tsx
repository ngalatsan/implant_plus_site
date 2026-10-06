import { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, Phone, MessageCircle, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { clinic, doctors, formatPrice, gallery, navigation, prices, services } from '@/data';
import { cn } from '@/lib/utils';

function Brand() {
  return <a className="brand" href="#home" aria-label="ИМПЛАНТ+ — на главную"><img src="/images/logo.png" alt="" width="34" height="34" /><span>ИМПЛАНТ+</span></a>;
}

function SectionHeading({ title, label }: { title: string; label: string }) {
  return <div className="section-heading"><div className="section-heading-row"><h2>{title}</h2><span className="eyebrow">{label}</span></div><Separator /></div>;
}

function SiteNavigation({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  return <NavigationMenu viewport={false} orientation={mobile ? 'vertical' : 'horizontal'} aria-label={mobile ? 'Мобильное меню' : 'Основное меню'} className={cn(mobile ? 'mobile-navigation' : 'desktop-navigation')}>
    <NavigationMenuList className={cn(mobile && 'flex-col items-stretch')}>
      {navigation.map(item => <NavigationMenuItem key={item.href}>
        <NavigationMenuLink asChild><a href={item.href} onClick={onNavigate}>{item.label}</a></NavigationMenuLink>
      </NavigationMenuItem>)}
    </NavigationMenuList>
  </NavigationMenu>;
}

function BookingButton({ doctor, onSelect, children = 'Записаться', size = 'default' }: { doctor?: string; onSelect: (doctor: string | null, trigger: HTMLButtonElement) => void; children?: React.ReactNode; size?: 'default' | 'lg' }) {
  return <DialogTrigger asChild><Button size={size} onClick={event => onSelect(doctor ?? null, event.currentTarget)}>{children}</Button></DialogTrigger>;
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [openPrices, setOpenPrices] = useState<string[]>([]);
  const bookingFocus = useRef<HTMLButtonElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [galleryEdges, setGalleryEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const viewport = galleryRef.current?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');
    if (!viewport) return;
    const update = () => setGalleryEdges({ start: viewport.scrollLeft <= 1, end: viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 1 });
    const resize = new ResizeObserver(update);
    resize.observe(viewport);
    viewport.addEventListener('scroll', update, { passive: true });
    update();
    return () => { resize.disconnect(); viewport.removeEventListener('scroll', update); };
  }, []);

  function scrollGallery(direction: number) {
    const viewport = galleryRef.current?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');
    const photos = galleryRef.current?.querySelector<HTMLElement>('.gallery-grid');
    if (!viewport || !photos?.firstElementChild) return;
    const step = photos.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(photos).columnGap);
    viewport.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const elements = document.querySelectorAll<HTMLElement>('.section-heading, .about-grid, .facts, .service-grid > [data-slot="card"], .doctor-card, .gallery-grid > figure, .contacts-grid > [data-slot="card"]');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else if (entry.boundingClientRect.top >= innerHeight) {
          entry.target.classList.remove('is-visible');
        }
      }
    }, { threshold: 0.12 });
    for (const element of elements) {
      element.classList.add('scroll-reveal');
      if (media.matches) element.classList.add('is-visible');
      else observer.observe(element);
    }
    const reduceMotion = () => {
      if (media.matches) {
        elements.forEach(element => element.classList.add('is-visible'));
        observer.disconnect();
      }
    };
    media.addEventListener('change', reduceMotion);
    return () => { observer.disconnect(); media.removeEventListener('change', reduceMotion); };
  }, []);

  function selectDoctor(doctor: string | null, trigger: HTMLButtonElement) {
    bookingFocus.current = trigger;
    setSelectedDoctor(doctor);
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      try { if (localStorage.getItem('implant-theme')) return; } catch {}
      setTheme(media.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('implant-theme', next); } catch {}
  }

  function showPrice(category: string) {
    setOpenPrices(current => current.includes(category) ? current : [...current, category]);
    requestAnimationFrame(() => document.getElementById(`price-${category}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }));
  }

  return <Dialog>
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <SiteNavigation />
        <div className="header-actions">
          <Button variant="outline" size="icon" aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'} aria-pressed={theme === 'dark'} onClick={toggleTheme}>{theme === 'dark' ? <Sun /> : <Moon />}</Button>
          <div className="header-booking"><BookingButton onSelect={selectDoctor} /></div>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild><Button variant="outline" size="icon" className="menu-toggle" aria-label="Открыть меню"><Menu /></Button></SheetTrigger>
            <SheetContent side="right">
              <SheetHeader><SheetTitle>ИМПЛАНТ+</SheetTitle><SheetDescription>Стоматологическая клиника · Анапа</SheetDescription></SheetHeader>
              <SiteNavigation mobile onNavigate={() => setMenuOpen(false)} />
              <div className="mobile-contact"><Separator /><p className="eyebrow">Запись на приём</p><Button asChild><a href={clinic.phoneHref}><Phone data-icon="inline-start" />{clinic.phone}</a></Button><SheetClose asChild><Button variant="outline">Закрыть меню</Button></SheetClose></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>

    <main id="main">
      <section className="hero inverse-surface" id="home" aria-labelledby="hero-title">
        <img className="hero-image" src="/images/main_photo.jpg" alt="Стоматологический кабинет клиники ИМПЛАНТ+" fetchPriority="high" width="720" height="1280" />
        <div className="hero-top"><span className="eyebrow">Стоматологическая клиника</span><span className="eyebrow">Анапа · Ленина, 187</span></div>
        <h1 id="hero-title"><span className="hero-name">ИМПЛАНТ+</span><span className="hero-tagline">Улыбка будущего</span></h1>
        <div className="hero-bottom"><p>Имплантация, протезирование и лечение зубов. Современное оборудование и опытные врачи — в одной клинике.</p><div className="hero-actions"><BookingButton onSelect={selectDoctor} size="lg">Записаться на приём</BookingButton><span className="eyebrow">{clinic.hours}</span></div></div>
      </section>

      <div className="container">
      <section className="section" id="about" aria-label="О клинике">
        <SectionHeading title="Забота о вашей улыбке" label="01 / О клинике" />
        <div className="about-grid"><p className="intro-copy">От лечения зубов до восстановления улыбки — поможем разобраться, с чего начать.</p><div className="body-copy"><p>ИМПЛАНТ+ — стоматологическая клиника в Анапе. Занимаемся лечением кариеса и его осложнений, имплантацией и протезированием.</p><p>В клинике также доступны хирургическая помощь, профессиональная гигиена, лазерная стоматология и диагностика. На приёме врач определит необходимое лечение и его стоимость.</p></div></div>
        <Separator className="facts-divider" />
        <div className="facts"><div><strong>2 врача</strong><p>Познакомьтесь с командой</p></div><div><strong>7 направлений</strong><p>Лечение и восстановление зубов</p></div><div><strong>Пн–Сб</strong><p>Приём с 09:00 до 18:00</p></div></div>
        <Separator />
      </section>

      <section className="section" id="services" aria-label="Услуги и цены">
        <SectionHeading title="Услуги и цены" label="02 / Направления" />
        <div className="service-grid">{services.map((service, index) => <Card key={service.title}>
          <CardHeader><span className="eyebrow">0{index + 1}</span><CardTitle><h3>{service.title}</h3></CardTitle><CardDescription>{service.description}</CardDescription></CardHeader>
          <CardContent className="mt-auto"><p className="service-price">от {formatPrice(service.price)}</p></CardContent>
          <CardFooter><Button variant="outline" onClick={() => showPrice(service.category)}>Посмотреть цены</Button></CardFooter>
        </Card>)}</div>
        <div className="price-heading"><h3>Полный прайс-лист</h3><span className="eyebrow">Выберите направление</span></div>
        <Accordion type="multiple" value={openPrices} onValueChange={setOpenPrices}>
          {prices.map((category, index) => <AccordionItem key={category.id} value={category.id} id={`price-${category.id}`}>
            <AccordionTrigger><span className="price-trigger-content"><span className="eyebrow">0{index + 1}</span><span>{category.title}</span></span><Badge variant="outline" className="price-count">{category.items.length} поз.</Badge></AccordionTrigger>
            <AccordionContent>
              {category.note && <p className="price-note">{category.note}</p>}
              <Table aria-label={`Стоимость услуг: ${category.title}`}>
                <TableHeader><TableRow><TableHead scope="col">Услуга</TableHead><TableHead scope="col" className="text-right">Стоимость</TableHead></TableRow></TableHeader>
                <TableBody>{category.items.map((item, itemIndex) => <TableRow key={`${category.id}-${itemIndex}`}><TableCell><span>{item.title}</span>{item.note && <span className="price-description">{item.note}</span>}</TableCell><TableCell className="text-right"><span className="price-value">{formatPrice(item.price)}</span></TableCell></TableRow>)}</TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>)}
        </Accordion>
        <p className="price-note price-disclaimer">Цены указаны в рублях. Точную стоимость лечения врач определит после осмотра и диагностики.</p>
      </section>

      <section className="section" id="doctors" aria-label="Врачи клиники">
        <SectionHeading title="Врачи" label="03 / Команда" />
        <p className="section-copy">Познакомьтесь с врачами, которым вы доверяете свою улыбку.</p>
        <div className="doctors-grid">{doctors.map((doctor, index) => <Card key={doctor.name} className="doctor-card">
          <AspectRatio ratio={4 / 5}><img src={doctor.photo} alt={doctor.name} className="doctor-photo" loading="lazy" width="720" height="900" /></AspectRatio>
          <CardHeader><span className="eyebrow">0{index + 1} / Врач</span><CardTitle><h3>{doctor.surname}<br />{doctor.firstName}</h3></CardTitle><CardDescription>{doctor.role}</CardDescription></CardHeader>
          <CardContent><Separator /><div className="doctor-experience"><Badge variant="outline">{doctor.experience}</Badge><p>{doctor.description}</p></div></CardContent>
          <CardFooter><BookingButton onSelect={selectDoctor} doctor={doctor.name}>Записаться к врачу</BookingButton></CardFooter>
        </Card>)}</div>
      </section>

      <section className="section" id="clinic" aria-label="Интерьер клиники">
        <SectionHeading title="Клиника" label="04 / Пространство" />
        <p className="section-copy">Зона ожидания и кабинеты ИМПЛАНТ+. Посмотрите, где проходит приём.</p>
        <div className="gallery-controls"><Button variant="outline" size="icon" aria-label="Предыдущие фотографии" aria-controls="clinic-gallery" disabled={galleryEdges.start} onClick={() => scrollGallery(-1)}><ChevronLeft /></Button><Button variant="outline" size="icon" aria-label="Следующие фотографии" aria-controls="clinic-gallery" disabled={galleryEdges.end} onClick={() => scrollGallery(1)}><ChevronRight /></Button></div>
        <ScrollArea ref={galleryRef} id="clinic-gallery" className="gallery-scroll" type="always" aria-label="Фотографии клиники"><div className="gallery-grid">{gallery.map(photo => <figure key={photo.src}><AspectRatio ratio={3 / 4}><img src={photo.src} alt={photo.title} loading="lazy" width="720" height="960" /></AspectRatio></figure>)}</div><ScrollBar orientation="horizontal" /></ScrollArea>
      </section>

      <section className="section" id="contacts" aria-label="Контакты и запись">
        <SectionHeading title="Ждём вас на приёме" label="05 / Контакты" />
        <div className="contacts-grid"><Card>
          <CardHeader><span className="eyebrow">Запись на приём</span><CardTitle><h3>Начните с консультации</h3></CardTitle><CardDescription>Позвоните или напишите администратору. Поможем выбрать врача и удобное время.</CardDescription></CardHeader>
          <CardContent><a className="contact-phone" href={clinic.phoneHref}>{clinic.phone}</a><Separator /><div className="contact-details"><address>{clinic.address}</address><p>{clinic.hours}<br />{clinic.dayOff}</p><p className="muted-copy">Остановка «Школа №7» — около 230 м от клиники.</p></div></CardContent>
          <CardFooter className="flex-wrap gap-3"><Button asChild><a href={clinic.phoneHref}><Phone data-icon="inline-start" />Позвонить</a></Button><Button variant="outline" asChild><a href={clinic.max} target="_blank" rel="noopener noreferrer"><MessageCircle data-icon="inline-start" />Написать в MAX</a></Button></CardFooter>
        </Card>
        <Card className="map-card"><CardHeader className="sr-only"><CardTitle>Как найти клинику</CardTitle><CardDescription>{clinic.address}</CardDescription></CardHeader><CardContent className="map-content"><iframe src={clinic.mapEmbed} title="Карта: ИМПЛАНТ+, Анапа, улица Ленина, 187" loading="lazy" allowFullScreen /></CardContent><CardFooter className="map-footer"><span>{clinic.address}</span><Button variant="link" asChild><a href={clinic.maps} target="_blank" rel="noopener noreferrer"><MapPin data-icon="inline-start" />Открыть карту</a></Button></CardFooter></Card>
        </div>
      </section>
      </div>
    </main>

    <footer className="footer inverse-surface"><div className="container"><div className="footer-top"><h2>Ваша улыбка.<br />Наше внимание.</h2><Brand /></div><Separator /><div className="footer-bottom"><p>© 2026 ИМПЛАНТ+ · Стоматологическая клиника</p><a href={clinic.maps} target="_blank" rel="noopener noreferrer">Мы в Яндекс Картах</a></div><p className="footer-note">Имеются противопоказания. Необходима консультация специалиста.</p></div></footer>

    <DialogContent onCloseAutoFocus={event => { event.preventDefault(); bookingFocus.current?.focus(); }}>
      <DialogHeader><span className="eyebrow">ИМПЛАНТ+ · Анапа</span><DialogTitle>Запись на приём</DialogTitle><DialogDescription>{selectedDoctor ? `Запись к врачу: ${selectedDoctor}. Администратор поможет выбрать удобное время.` : 'Позвоните или напишите администратору. Поможем выбрать врача и согласовать время приёма.'}</DialogDescription></DialogHeader>
      <a href={clinic.phoneHref} className="dialog-phone">{clinic.phone}</a>
      <div className="dialog-actions"><Button asChild size="lg"><a href={clinic.phoneHref}><Phone data-icon="inline-start" />Позвонить</a></Button><Button asChild variant="outline" size="lg"><a href={clinic.max} target="_blank" rel="noopener noreferrer"><MessageCircle data-icon="inline-start" />Написать в MAX</a></Button></div>
      <Separator /><p className="dialog-meta">{clinic.hours}<br />{clinic.address}</p>
    </DialogContent>
  </Dialog>;
}

export default App;
