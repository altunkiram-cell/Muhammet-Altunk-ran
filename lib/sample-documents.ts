export interface SampleDocSet {
  id: string;
  name: string;
  period: string;
  description: string;
  documents: {
    label: string;
    title: string;
    content: string;
  }[];
}

export const SAMPLE_DOCUMENT_SETS: SampleDocSet[] = [
  {
    id: 'amasya-1919',
    name: 'Amasya Genelgesi (22 Haziran 1919)',
    period: 'Haziran 1919',
    description: 'Millî Mücadele\'nin amaç, gerekçe ve yöntemini belirleyen tarihî bildiri ve telgraflar.',
    documents: [
      {
        label: 'Belge 1',
        title: 'Amasya Genelgesi Temel Maddeleri',
        content: `Belge 1:
1. Vatanın bütünlüğü, milletin istiklali tehlikededir.
2. İstanbul Hükûmeti üzerine aldığı sorumluluğun gereklerini yerine getirememektedir. Bu durum milletimizi yok olmuş gibi göstermektedir.
3. Milletin istiklalini yine milletin azim ve kararı kurtaracaktır.
4. Milletin haklarını dünyaya duyurmak için her türlü tesir ve denetimden uzak millî bir heyetin varlığı zaruridir.
5. Sivas'ta millî bir kongrenin acele toplanması kararlaştırılmıştır.
6. Bunun için bütün vilayetlerin her livasından milletin güvenini kazanmış üç murahhasın (temsilcinin) süratle yola çıkarılması gerekmektedir.`
      },
      {
        label: 'Belge 2',
        title: 'Mustafa Kemal Paşa\'nın Kolordulara Gönderdiği Gizli Şifre',
        content: `Belge 2:
Mustafa Kemal Paşa 22 Haziran 1919 gecesi Amasya'dan 15. Kolordu Komutanı Kâzım Karabekir ve diğer ordu müfettişlerine gönderdiği telgrafta şöyle bildirdi:
"Artık İstanbul Anadolu'ya hâkim değil, tâbi olmak mecburiyetindedir. Milletin sinesinde hiçbir şahsi emel beslemeksizin yalnız milletin kurtuluşu için çalışacağız. Erzurum Kongresi'nin toplanmasını müteakip Sivas'ta umumi kongre akdedilecektir."`
      },
      {
        label: 'Belge 3',
        title: 'İstanbul Hükûmeti Harbiye Nezareti Telgrafı',
        content: `Belge 3:
Harbiye Nazırı Şevket Turgut Paşa'dan Mustafa Kemal Paşa'ya gönderilen 23 Haziran 1919 tarihli tebliğ:
"Padişah hazretlerinin iradesi mucibince memuriyetinize nihayet verilmiştir. Derhal İstanbul'a avdetiniz emrolunur. Vilayetlere ve ordu birliklerine sizin adınıza tebligatta bulunulmaması resmen bildirilmiştir."`
      }
    ]
  },
  {
    id: 'erzurum-1919',
    name: 'Erzurum Kongresi Kararları (7 Ağustos 1919)',
    period: 'Ağustos 1919',
    description: 'Doğu vilayetleri adına toplanan ve vatanın bölünmezliğini ilan eden kongre kararları.',
    documents: [
      {
        label: 'Belge 1',
        title: 'Erzurum Kongresi Bildirgesi',
        content: `Belge 1:
Erzurum Kongresi Beyannamesi Madde 1: Millî sınırlar içinde bulunan vatan parçaları bir bütündür; birbirinden ayrılamaz.
Madde 2: Her türlü yabancı işgal ve müdahalesine karşı ve İstanbul Hükûmeti'nin dağılması hâlinde millet topyekûn kendisini savunacak ve direnecektir.
Madde 3: Vatanın istiklalini korumaya İstanbul Hükûmeti muktedir olamazsa geçici bir hükûmet kurulacaktır.`
      },
      {
        label: 'Belge 2',
        title: 'Manda ve Himaye ile Meclis Kararı',
        content: `Belge 2:
Erzurum Kongresi Beyannamesi Madde 4: Kuvâ-yı Milliyeyi amil, irade-i milliyeyi hâkim kılmak esastır.
Madde 6: Hristiyan unsurlara siyasi hâkimiyetimizi ve sosyal dengemizi bozacak ayrıcalıklar verilemez.
Madde 7: Manda ve himaye kabul olunamaz.
Madde 8: Millet Meclisi'nin derhal toplanması ve hükûmetin icraatının meclis denetimine tabi tutulması için çalışılacaktır.`
      },
      {
        label: 'Belge 3',
        title: 'Heyet-i Temsiliye Mazbatası',
        content: `Belge 3:
Kongre Heyeti kararı: Şarkî Anadolu Müdafaa-i Hukuk Cemiyeti adına milleti temsil etmek üzere dokuz kişilik bir Heyet-i Temsiliye seçilmiştir. Heyet başkanlığına Mustafa Kemal Paşa getirilmiştir. Heyet, meclis toplanıncaya kadar millî davayı yürütmeye yetkilidir.`
      }
    ]
  },
  {
    id: 'misak-i-milli-1920',
    name: 'Misak-ı Millî Beyannamesi (28 Ocak 1920)',
    period: 'Ocak 1920',
    description: 'Son Osmanlı Meclis-i Mebusanı tarafından kabul edilen ulusal antlaşma metni.',
    documents: [
      {
        label: 'Belge 1',
        title: 'Sınırlar ve Arap Toprakları Maddesi',
        content: `Belge 1:
Misak-ı Millî Kararları Madde 1: 30 Ekim 1918 Mondros Mütarekesi imzalandığı sırada düşman orduları işgali altında kalan Arap çoğunluğunun yerleşik olduğu bölgelerin geleceği halkın serbestçe vereceği oylarla belirlenmelidir. Söz konusu mütareke hattı içinde ve dışında kalan Türk ve İslam çoğunluğunun bulunduğu kısımlar ise bölünmez bir bütündür.`
      },
      {
        label: 'Belge 2',
        title: 'Kars, Ardahan, Batum ve Batı Trakya',
        content: `Belge 2:
Misak-ı Millî Madde 2: Halkı ilk serbest kaldıkları zamanda ana vatana katılmak için oy vermiş olan Kars, Ardahan ve Batum (Elviye-i Selâse) için gerekirse yeniden serbestçe halkoyuna başvurulmasını kabul ederiz.
Madde 3: Batı Trakya'nın hukuki durumunun tayini de orada yaşayanların tam bir hürriyet içinde verecekleri oylarla tespit edilmelidir.`
      },
      {
        label: 'Belge 3',
        title: 'Boğazlar ve Kapitülasyonlar Maddesi',
        content: `Belge 3:
Misak-ı Millî Madde 4: Hilafet merkezi ve saltanatın başkenti olan İstanbul ile Marmara Denizi'nin güvenliği her türlü tehlikeden uzak tutulmalıdır. Bu esas saklı kalmak şartıyla Boğazların dünya ticaretine açılması ilgili devletlerin oybirliğiyle vereceği karara bağlıdır.
Madde 6: Millî ve iktisadi gelişmemizi temin etmek amacıyla siyasi, adli ve mali gelişmemizi engelleyen sınırlamalar (kapitülasyonlar) kesinlikle kaldırılmalıdır.`
      }
    ]
  }
];
