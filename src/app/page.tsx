import Link from "next/link";
import { WireRow } from "@/components/layout/WireRow";
import { StatusPill } from "@/components/status/StatusPill";
import { CopyField } from "@/components/ui/CopyField";
import { PersonCard, type Person } from "@/components/people/PersonCard";

/**
 * The project key, printed so that "we will never ask for your nsec" stops
 * being an unfalsifiable slogan. Without a canonical key on the page, a reader
 * has nothing to compare an impersonator against.
 *
 * Every value below was re-derived this session from the hex in the live
 * /.well-known/nostr.json by bech32 encoding, and each round-trip decoded back
 * to the identical hex. The NIP-05 key name in that file is "nostrarabia",
 * not "_".
 */
const PROJECT_NPUB = "npub1syk07kh6tkwrksyzhqk8qdjul5kj08p842gjxyacljlavhzq4m4slmdu3p";

const PEOPLE: Person[] = [
  {
    nameAr: "سولي",
    nip05: "sooly@nostrarabia.com",
    npub: "npub1hzz35pkl67w53lpj2g62zh56g63j5zvz4q3m2nxlsfg5hxcjpwssaynqel",
    githubUser: "s00ly",
    site: "https://www.neowealth.xyz",
    siteLabel: "neowealth.xyz",
  },
  {
    nameAr: "تي كاي",
    nip05: "tkay@nostrarabia.com",
    npub: "npub1nje4ghpkjsxe5thcd4gdt3agl2usxyxv3xxyx39ul3xgytl5009q87l02j",
    githubUser: "tkhumush",
    site: "https://tkay.npub.pro",
    siteLabel: "tkay.npub.pro",
  },
];

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`border-t border-brand-hairline py-12 sm:py-16 ${className}`}>
      {children}
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[28px] leading-[1.4] font-extrabold">{children}</h2>;
}

function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2.5 max-w-[64ch] text-[17px] leading-[1.75] text-brand-muted">{children}</p>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-[66ch] text-[15px] leading-[1.7] text-brand-muted">{children}</p>
  );
}

/**
 * Prose, not cards. A card implies a feature. These are explanations, so they
 * take the same seam language the server rows use rather than a box each.
 */
function IntroBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-brand-hairline py-6">
      <h3 className="text-[18px] leading-[1.5] font-bold">{title}</h3>
      <div className="mt-2 flex flex-col gap-2.5 text-[16px] leading-[1.75] text-brand-muted">
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 sm:px-8">
      {/* Hero */}
      <section className="max-w-[66ch] py-12 sm:py-20">
        <h1 className="text-[30px] leading-[1.3] font-extrabold sm:text-[44px]">
          حسابك ليس عند شركة.
        </h1>
        <p className="mt-4 text-[17px] leading-[1.75] text-brand-muted">
          على فيسبوك أو إكس، اسمك وقائمة متابعيك داخل شركة واحدة، وإن أغلقت الحساب ذهب الاثنان.
          هنا هما رقم صغير على هاتفك أنت. بدّل التطبيق، ويبقيان.
        </p>
        <p className="mt-3 text-[15px] leading-[1.7] text-brand-muted">
          <b className="font-bold text-brand-text">ولا يقف الأمر عند منشور ورد.</b> الاتفاق على شكل
          الرسالة، لا على ما بداخلها. فالمفتاح نفسه يفتح لك مكالمة فيديو، ومتجر تطبيقات، وسوقاً،
          ومكاناً تنشر فيه مقالاً طويلاً، وراديو تسمعه. كلّها تكتب على الظرف نفسه وتوقّع بختمك نفسه.{" "}
          <Link
            href="/apps"
            className="font-bold text-brand-orange underline decoration-brand-orange decoration-1 underline-offset-4 hover:decoration-2"
          >
            القائمة كاملة
          </Link>
          .
        </p>
        {/*
          Every clause here survived a research pass that killed nineteen
          stronger-sounding framings. Three are worth recording, because each
          would have been refuted by this site's own copy:

          - NOT "Nostr makes shadowbanning impossible". False at source: strfry,
            which our own relay runs, ships a shadowReject that returns success
            to the client and discards the event. A relay can lie.
          - NOT "you will always know if you were blocked". The site itself
            discloses that a rejected note still looks published to its author.
          - NOT a figure for how few people use Nostr. Credible published
            estimates span four orders of magnitude, so no number is honest.

          What IS true is the distinction below. A refusal is a protocol message
          the agreement obliges the relay to send, with a reason. Our disclosed
          case is a CLIENT gap, the refusal was on the wire and the app did not
          show it, and an app is a thing you can change. A platform reducing your
          reach sends no such message and answers no such question. The last
          sentence gives the cause of the obscurity rather than claiming to have
          measured what anyone knows.
        */}
        <p className="mt-3 text-[15px] leading-[1.7] text-brand-muted">
          وحين تقلّل منصة وصول منشورك، لا تعرف أنّها فعلت، ولا تملك سؤالاً تسألها إيّاه. أمّا هنا
          فالاتفاق يوجب على الريلاي أن يردّ بالرفض وسببه. وقد لا يعرض تطبيقك هذا الردّ، لكنّ الإخفاء
          يكون في التطبيق، والتطبيق تبدّله. ولو رفضك ريلاي، خسرت قرّاءه وحدهم، ولم تخسر اسمك ولا
          قائمة متابعيك. ولا أحد يملك نوستر ليعلن عنه، ولهذا لا تجد عليه اليوم أكثر من تتابعهم.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/start"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-orange px-6 text-[16px] font-bold text-brand-bg transition-opacity hover:opacity-90 active:opacity-75"
          >
            ابدأ من هنا
          </Link>
          <Link
            href="/learn/what-is-nostr"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-brand-border-ui px-6 text-[16px] font-bold text-brand-text transition-colors hover:border-brand-orange hover:text-brand-orange active:bg-brand-surface"
          >
            تعرّف على نوستر
          </Link>
        </div>
      </section>

      {/* The servers, the credibility section */}
      <Section id="servers">
        <H2>الخادمان اللذان نشغّلهما</H2>
        <Lede>
          جهازان يعملان ليل نهار. الأول يحفظ الرسائل ويسلّمها لمن يطلبها، وهذا اسمه ريلاي. والثاني
          يحفظ الصور والملفات. العنوانان هنا كي تضعهما بنفسك في تطبيقك.
        </Lede>

        <div className="mt-6">
          <WireRow
            label="الريلاي"
            value="wss://relay.nostrarabia.com"
            copyLabel="انسخ عنوان الريلاي"
            status={<StatusPill endpoint="/api/relay-status" service="الريلاي" />}
            micro={
              <>
                القراءة مفتوحة للجميع، والنشر بقائمة معتمدة. اعرف{" "}
                <Link
                  href="/start"
                  className="underline decoration-brand-border-ui decoration-1 underline-offset-[3px] transition-colors hover:text-brand-orange hover:decoration-brand-orange active:opacity-70"
                >
                  كيف تضيفه إلى تطبيقك
                </Link>
                .
              </>
            }
          />
          <WireRow
            label="خادم الوسائط"
            value="https://media.nostrarabia.com"
            copyLabel="انسخ عنوان خادم الوسائط"
            status={<StatusPill endpoint="/api/media-status" service="خادم الوسائط" />}
            micro={
              <>
                يحفظ الصور والملفات ببروتوكول{" "}
                <bdi dir="ltr" lang="en">
                  Blossom
                </bdi>
                . والرفع عليه بقائمة معتمدة، من تطبيق يدعمه، لا بفتح العنوان.
              </>
            }
          />
        </div>

        <Note>
          يُفحص الخادمان تلقائياً عند فتح الصفحة، وإن تعذّر الفحص ظهرت الحالة «غير معروفة» بدل أن
          نزعم أنّهما يعملان. والحالة تعني أنّ الخادم يستجيب، لا أنّك تستطيع النشر عليه.
        </Note>
      </Section>

      {/* What makes Nostr different */}
      <Section>
        <H2>ما يميّز نوستر</H2>
        <Lede>
          نوستر طريقة للنشر والقراءة بلا شركة في الوسط. لا شيء تشتريه، ولا اشتراك، ولا محفظة.
        </Lede>

        {/* Six blocks, three across. Five in two columns left an orphan on its
            own row with a dead gap beside it; six in threes fills both rows. */}
        <div className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          <IntroBlock title="الرقم السري عندك">
            <p>
              الرقم السري يبقى حيث تضعه أنت. إن حفظته في جهازك أو في تطبيق توقيع، فلا نسخة عندنا ولا
              عند غيرنا. وإن أعطيته لموقع، صار عنده أيضاً.
            </p>
            <p>
              ولا أحد يعيده إليك إن ضاع. ومن نسخه صار قادراً على التوقيع باسمك، ولا توجد جهة تلغي
              ختمه.
            </p>
          </IntroBlock>

          <IntroBlock title="العلامة تسافر مع المنشور">
            <p>
              كل منشور يحمل علامته معه. تفحصها في أي مكان، والفحص لا يحتاج خادماً ولا حساباً ولا
              إذناً من أحد. لو تبدّل حرف واحد بطلت العلامة.
            </p>
            <p>والعلامة تثبت أيّ ختم وقّع، لا أن صاحبه هو من تظن، ولا أن الكلام صحيح.</p>
          </IntroBlock>

          <IntroBlock title="كل ريلاي يقرر بنفسه">
            <p>
              تحتاج ريلاي ليصلك المنشور، ولا تحتاج أحداً لتتأكد من علامته. لا أحد يستطيع إلغاء رقمك
              العام، ولكن أي ريلاي يستطيع أن يرفض منشوراتك. لهذا تنشر على أكثر من ريلاي.
            </p>
          </IntroBlock>

          <IntroBlock title="لا خوارزمية بينك وبين ما تقرأ">
            <p>
              تطبيقك يطلب منشورات من تتابعهم ويعرضها بترتيبها الزمني. لا أحد يرتّبها لك، ولا يدسّ
              فيها ما لم تطلبه. والتطبيق نفسه يختار ما يعرض، فإن لم يعجبك اختياره بدّله.
            </p>
          </IntroBlock>

          {/*
            The sixth block. It asserts nothing new: it is the hero's own claim
            about one key opening a video call, an app store, a market and a
            long-form site, stated once more where the reader has just learned
            what a key is, and it is the bridge to the apps directory.
          */}
          <IntroBlock title="مفتاح واحد يفتح كل شيء">
            <p>
              التطبيقات على نوستر تتفق على شكل الرسالة، لا على من يملكها. فالمفتاح الذي تنشئه اليوم
              يعمل في تطبيق المنشورات، وفي المحادثات، وفي رفع الصور، وفي المتجر، بلا تسجيل جديد في
              أيٍّ منها.
            </p>
            <p>
              وإن تركت تطبيقاً إلى غيره، مشت معك متابعاتك ومنشوراتك، لأنها ليست محفوظة عنده أصلاً.
            </p>
          </IntroBlock>

          <IntroBlock title="نشغّل أدواتنا بأنفسنا">
            <p>
              نحن نشغّل ريلاي نوستر عربيّة وخادم الوسائط بأنفسنا. الريلاي مفتوح للقراءة للجميع،
              والنشر عليه محصور في قائمة معتمدة، مثل لوحة في مدخل عمارة.
            </p>
            <p>
              ولو أغلقناهما غداً، تأخذ ختمك وتنشر من مكان آخر. أما الصور المرفوعة على خادمنا فروابطها
              تتوقف بتوقفه.
            </p>
          </IntroBlock>
        </div>

        {/*
          Never boxed and never tinted. A box turns a mechanical fact into a
          disclaimer, and a disclaimer gets read as legal noise rather than as
          the other half of the freedom described above it.
        */}
        <div className="mt-8 max-w-[64ch] border-t border-brand-hairline pt-6">
          <h3 className="text-[18px] leading-[1.5] font-bold">الوجه الآخر</h3>
          <div className="mt-2 flex flex-col gap-2.5 text-[16px] leading-[1.75] text-brand-muted">
            <p>
              ما وقّعته لا تستطيع إنكاره. المنشورات العامة موقّعة لا مشفّرة، يقرؤها الجميع اليوم
              وبعد سنوات.
            </p>
            <p>
              والحذف طلب. قد يستجيب له الريلاي وقد لا يستجيب. وقد تكون نسخة وصلت إلى ريلاي لم تختره.
            </p>
          </div>
        </div>
      </Section>

      {/* Identity and the one irreversible harm */}
      <Section id="security">
        <div className="rounded-s-xl border-s-[3px] border-brand-danger bg-brand-danger-tint p-6">
          {/* A text label, so the meaning survives greyscale and colour blindness. */}
          <span className="inline-block rounded border border-brand-danger px-2 text-[13px] font-extrabold text-brand-danger">
            مهم
          </span>

          {/*
            h2, not h3. These two are peers of the other section headings, and as
            h3 they were nested under «ما يميّز نوستر» in the outline, which put
            the canonical npub and the nsec promise somewhere a screen-reader
            user scanning the heading list would not find them. Size is set
            explicitly, so the outline is corrected without changing the design.
          */}
          <h2 className="mt-3.5 text-[21px] leading-[1.45] font-bold">حساب المشروع الرسمي</h2>
          <div className="mt-3">
            <CopyField value={PROJECT_NPUB} label="انسخ المفتاح المعلن للمشروع" />
          </div>
          <p className="mt-3.5 max-w-[64ch] text-[16px] leading-[1.75] text-brand-muted">
            للتأكّد يكفي أوّل ستة أحرف وآخر ستة،{" "}
            <bdi dir="ltr" lang="en">
              npub1syk07
            </bdi>{" "}
            ثم{" "}
            <bdi dir="ltr" lang="en">
              lmdu3p
            </bdi>
            . <b className="font-bold text-brand-text">ثِق بالرقم، لا بالاسم.</b> وأي حساب آخر يدّعي
            تمثيلنا فهو ليس منّا.
          </p>

          <h2 className="mt-6 text-[21px] leading-[1.45] font-bold">رقمان، لا كلمة مرور</h2>
          <p className="mt-2 max-w-[64ch] text-[16px] leading-[1.75] text-brand-muted">
            واحد تنشره، وواحد يجب ألّا يخرج من جهازك. لا زرّ «نسيت كلمة المرور» هنا. من ضاع منه الرقم
            السري ضاعت هويته، ولا يستطيع أحد إعادتها، لا نحن ولا سوانا. ومن أخذ منه نسخة صار قادراً
            على النشر باسمك، ولا إلغاء ولا استبدال.{" "}
            <b className="font-bold text-brand-danger">ولن نطلبه منك أبداً. من طلبه فقد كشف نفسه.</b>
          </p>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-brand-muted">
            منشوراتك العامة <b className="font-bold text-brand-text">موقَّعة لا مشفَّرة</b>. يمكن
            التأكّد من كاتبها، ويستطيع أي أحد قراءتها.
          </p>
        </div>
      </Section>

      {/* The whitelist, told before it is discovered as a failure */}
      <Section id="publishing">
        <H2>قواعد النشر على ريلاينا</H2>
        <Lede>
          القراءة للجميع. والنشر مقصور على قائمة معتمدة قصيرة، لأن ريلاياً مفتوحاً للنشر يمتلئ آلياً
          خلال أيام. لا حساب لك عندنا لكي يُغلق.
        </Lede>
        <Note>
          وإن حاولت النشر بمفتاح غير معتمد، ردّ الريلاي بالرفض.{" "}
          <b className="font-bold text-brand-text">وقد لا يُظهر لك تطبيقك هذا الرفض</b>، فيبقى منشورك
          ظاهراً أمامك، لكنه لن يظهر لمن يقرأ من ريلاينا. وهذا ليس عطلاً.
        </Note>
        <Note>
          ولا تحتاج إذننا لتستخدم نوستر. أنشئ مفتاحك الآن وانشر عبر الريلايات العامة:{" "}
          <bdi dir="ltr" lang="en">
            relay.damus.io
          </bdi>{" "}
          و
          <bdi dir="ltr" lang="en">
            nos.lol
          </bdi>{" "}
          و
          <bdi dir="ltr" lang="en">
            relay.primal.net
          </bdi>
          .
        </Note>
        <Note>
          وللانضمام إلى القائمة، راسِلنا على نوستر من الحساب نفسه الذي تريد اعتماده، وأرسل{" "}
          <bdi dir="ltr" lang="en">
            npub
          </bdi>{" "}
          وحده، وهو غير سرّي. حسابانا{" "}
          <bdi dir="ltr" lang="en">
            sooly@nostrarabia.com
          </bdi>{" "}
          و
          <bdi dir="ltr" lang="en">
            tkay@nostrarabia.com
          </bdi>
          ، والمراجعة يدوية.
        </Note>
      </Section>

      {/* Four steps */}
      <Section>
        <H2>ابدأ في أربع خطوات</H2>
        <ol className="mt-6 grid list-none gap-4 p-0">
          {[
            "نزّل تطبيق نوستر. سيختار لك رقماً سرياً واحداً، ويحسب منه رقمك المعلن.",
            "خذ النسخة الاحتياطية التي يعرضها التطبيق على محمل الجدّ. لا يوجد استرجاع لاحقاً. ورقمك السري محفوظ على هذا الجهاز وحده، فلو ضاع الجهاز أو أُعيد ضبطه ضاع معه.",
            "أضف ثلاثة أو أربعة ريلايات في الإعدادات، منها ريلاينا. القراءة تعمل فوراً.",
            "اختيارياً، اسم مقروء يسهّل على الناس إيجادك. ليس حساباً ولا كلمة مرور، وفقدانه لا يمسّ هويتك.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-brand-border-ui font-mono text-[13px] font-extrabold text-brand-purple"
              >
                {i + 1}
              </span>
              <p className="max-w-[64ch] text-[16px] leading-[1.75] text-brand-muted">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Who is behind this */}
      <Section id="who">
        <H2>من نحن</H2>
        <Lede>
          الشيفرة والمحتوى منشوران للجميع، ومفتاحانا أدناه. كل ما ننشره موقَّع بهما، فتستطيع التحقّق
          بنفسك.
        </Lede>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {PEOPLE.map((person) => (
            <PersonCard key={person.nip05} person={person} />
          ))}
        </div>
      </Section>

      {/* Follow the project account, and the hashtag ask */}
      <Section id="follow">
        <H2>تابعنا على نوستر</H2>
        <Lede>
          حساب نوستر عربيّة على نوستر ينشر ما يخصّ نوستر بالعربية، ويعيد نشر ما يستحقّ من منشوراتكم.
          أضِفه بأيٍّ من الاثنين أدناه، فكلاهما يدلّ على الحساب نفسه.
        </Lede>

        <div className="mt-6">
          <WireRow
            label="الاسم المقروء"
            value="arabi@nostrarabia.com"
            copyLabel="انسخ الاسم المقروء لحساب نوستر عربيّة"
            micro="اسم يسهل حفظه، ويُتحقَّق منه من هذا الموقع نفسه، فمن انتحله لن يستطيع تزوير التحقّق."
          />
          <WireRow
            label="المفتاح المعلن"
            value={PROJECT_NPUB}
            copyLabel="انسخ المفتاح المعلن لحساب نوستر عربيّة"
            micro={
              <>
                هو الرقم نفسه المطبوع في «حساب المشروع الرسمي» أعلاه، فقارنه به.{" "}
                <a
                  href={`https://njump.me/${PROJECT_NPUB}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-brand-border-ui decoration-1 underline-offset-[3px] transition-colors hover:text-brand-orange hover:decoration-brand-orange active:opacity-70"
                >
                  افتح الحساب
                  <span aria-hidden="true" className="ms-1">
                    ↗
                  </span>
                  <span className="sr-only">, يفتح في نافذة جديدة</span>
                </a>
              </>
            }
          />
        </div>

        <Note>
          وأعضاء نوستر عربيّة كلّهم مع معرّفاتهم في{" "}
          <Link
            href="/community"
            className="font-bold text-brand-orange underline decoration-brand-orange decoration-1 underline-offset-4 hover:decoration-2"
          >
            صفحة المجتمع
          </Link>
          .
        </Note>

        <h3 className="mt-8 text-[18px] leading-[1.5] font-bold">
          ضع وسم{" "}
          <bdi dir="ltr" lang="en">
            #nostrarabia
          </bdi>{" "}
          على منشورك
        </h3>
        <Note>
          الوسم يجعل منشورك ظاهراً لنا ولمن يبحث عنه بالعربية. نتابعه على الريلايات العامة، ونعيد
          نشر ما نراه مفيداً من حساب المشروع، فيصل إلى من يتابعنا.
        </Note>
        {/*
          The load-bearing correction. Without it a reader tags a note, sees it
          nowhere on our relay, and concludes the tag is broken. It is not: the
          note was never eligible to be stored there. This is the same defect the
          publishing-rules section exists to prevent, and the two must agree.
        */}
        <Note>
          والوسم وحده لا يضع منشورك على ريلاينا. النشر عليه يبقى محصوراً في القائمة المعتمدة. فإن
          كنت منها، حُفظ منشورك عندنا أيضاً ووجده من يقرأ من ريلاينا بالوسم نفسه. وإن لم تكن، فمنشورك
          يعيش على الريلايات العامة، ونحن نصل إليه هناك.
        </Note>
      </Section>

      {/* Support, asked once, near the end */}
      <Section id="support">
        <H2>ادعم التشغيل</H2>

        {/*
          The belief is stated on its own line and first, then the mechanics
          explain the cost. Ordered the other way it would read as a cause
          borrowed to raise money, which is the opposite of the dignity the rest
          of this section is written for.
        */}
        <p className="mt-3 max-w-[64ch] text-[17px] leading-[1.75] font-bold text-brand-text">
          نؤمن بحرية التعبير، وبفلسطين حرة.
        </p>
        <Lede>
          ونوستر يجعل الأولى قابلة للتطبيق. ما وقّعته بمفتاحك لا تستطيع شركة واحدة محوه من الشبكة.
          لكنّ الكلام لا ينتقل بلا خوادم تحمله، والريلاي وخادم الوسائط يعملان على خوادم تُدفَع
          شهرياً. لا يموّلنا معلن ولا شركة، فالتكلفة علينا، وكل مساهمة تطيل بقاءهما على الشبكة.
        </Lede>
        <Note>المساهمة في البنية لا اشتراك فيها، ولا تمنح صلاحية النشر على الريلاي.</Note>
        <div className="mt-6">
          <WireRow
            label="عنوان لايتنينغ"
            value="nostrarabia@getalby.com"
            copyLabel="انسخ عنوان لايتنينغ"
          />
        </div>
        <Note>
          يقبل هذا العنوان الزاب عبر نوستر، لكن ريلاينا لا يُعلن حالياً دعم{" "}
          <bdi dir="ltr" lang="en">
            NIP-57
          </bdi>
          ، فقد لا تظهر الزابّات عليه.
        </Note>
      </Section>
    </main>
  );
}
