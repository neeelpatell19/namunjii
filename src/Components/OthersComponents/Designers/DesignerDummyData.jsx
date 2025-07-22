import { FaFacebookF, FaInstagram } from "react-icons/fa";

const commonDescription = (
    <div>
        <p>Sleek and timeless. Titanium glasses with an innovative bridge. A frame to suit every face, Morgan is a classic ‘panto’ shape. Named after James Morgan, the engineer who built the Regent's Canal, it features custom elements including fluid single piece bridge, adjustable nose pads and temple tips based on Constantin Brâncuși's Bird in Space.</p>
        {/* <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>99.7% pure titanium front</li>
            <li>More than 4hv on the Vickers hardness test.</li>
            <li>Ion plated to over 0.3µ</li>
            <li>Weighs under 5.0g</li>
            <li>Adjustable titanium nose pads for a comfortable fit</li>
            <li>UV protection</li>
        </ul> */}
    </div>
);

const commonBrief = (
  <div>
    <p>Sleek and timeless. Titanium glasses with an innovative bridge. A frame to suit every face, Morgan is a classic ‘panto’ shape. Named after James Morgan, the engineer who built the Regent's Canal, it features custom elements including fluid single piece bridge, adjustable nose pads and temple tips based on Constantin Brâncuși's Bird in Space.</p>
    <br />
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      <li>99.7% pure titanium front</li>
      <li>More than 4hv on the Vickers hardness test.</li>
      <li>Ion plated to over 0.3µ</li>
      <li>Weighs under 5.0g</li>
      <li>Adjustable titanium nose pads for a comfortable fit</li>
      <li>UV protection</li>
    </ul>
  </div>
);

const DesignerDummyData = [
    {
        slug: "isabella-laurent",
        image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        DesignerName: "Isabella Laurent",
        DesignerDescription: "Isabella crafts timeless couture with a modern twist, specializing in silk evening gowns and bespoke luxury pieces.",
        DesignerProducts: [
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Silk Evening Gown",
                ProductDescription: commonDescription,
                price: 18500,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Crystal-Embellished Cape",
                ProductDescription: commonDescription,
                price: 23750,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Velvet Cocktail Dress",
                ProductDescription: commonDescription,
                price: 31200,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Pearl-Trimmed Blazer",
                ProductDescription: commonDescription,
                price: 12900,
                availability: "no",
                ProductBrief: commonBrief,
            },
        ],
        DesignerSocialMedia: [
            {
                icon: <FaFacebookF />,
                link: "https://www.facebook.com/isabellalaurent",
            },
            {
                icon: <FaInstagram />,
                link: "https://www.instagram.com/isabellalaurent",
            },
        ],
    },
    {
        slug: "luca-moretti",
        image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        DesignerName: "Luca Moretti",
        DesignerDescription: "Luca is renowned for his Italian craftsmanship, blending classic tailoring with avant-garde luxury fabrics.",
        DesignerProducts: [
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Cashmere Overcoat",
                ProductDescription: commonDescription,
                price: 22100,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Wool-Blend Suit",
                ProductDescription: commonDescription,
                price: 39800,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Silk-Lined Tuxedo",
                ProductDescription: commonDescription,
                price: 17600,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Leather Accent Blazer",
                ProductDescription: commonDescription,
                price: 15400,
                availability: "no",
                ProductBrief: commonBrief,
            },
        ],
        DesignerSocialMedia: [
            {
                icon: <FaFacebookF />,
                link: "https://www.facebook.com/lucamoretti",
            },
            {
                icon: <FaInstagram />,
                link: "https://www.instagram.com/lucamoretti",
            },
        ],
    },
    {
        slug: "sophie-dubois",
        image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        DesignerName: "Sophie Dubois",
        DesignerDescription: "Sophie is a Parisian designer celebrated for her haute couture dresses and luxury ready-to-wear collections.",
        DesignerProducts: [
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Chiffon Ball Gown",
                ProductDescription: commonDescription,
                price: 31200,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Embroidered Mini Dress",
                ProductDescription: commonDescription,
                price: 14500,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Feathered Cape Dress",
                ProductDescription: commonDescription,
                price: 25600,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Sequin Sheath Dress",
                ProductDescription: commonDescription,
                price: 38400,
                availability: "no",
                ProductBrief: commonBrief,
            },
        ],
        DesignerSocialMedia: [
            {
                icon: <FaFacebookF />,
                link: "https://www.facebook.com/sophiedubois",
            },
            {
                icon: <FaInstagram />,
                link: "https://www.instagram.com/sophiedubois",
            },
        ],
    },
    {
        slug: "mateo-garcia",
        image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        DesignerName: "Mateo García",
        DesignerDescription: "Mateo fuses Spanish tradition with modern luxury, known for his bold prints and opulent fabrics.",
        DesignerProducts: [
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Baroque Print Blazer",
                ProductDescription: commonDescription,
                price: 27700,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Velvet Trousers",
                ProductDescription: commonDescription,
                price: 19100,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Embroidered Kimono Jacket",
                ProductDescription: commonDescription,
                price: 36200,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Silk Scarf",
                ProductDescription: commonDescription,
                price: 11800,
                availability: "no",
                ProductBrief: commonBrief,
            },
        ],
        DesignerSocialMedia: [
            {
                icon: <FaFacebookF />,
                link: "https://www.facebook.com/mateogarcia",
            },
            {
                icon: <FaInstagram />,
                link: "https://www.instagram.com/mateogarcia",
            },
        ],
    },
    {
        slug: "ava-chen",
        image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        DesignerName: "Ava Chen",
        DesignerDescription: "Ava is a pioneer in sustainable luxury, creating eco-friendly couture with a focus on organic materials.",
        DesignerProducts: [
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Organic Cotton Dress",
                ProductDescription: commonDescription,
                price: 39900,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Recycled Wool Coat",
                ProductDescription: commonDescription,
                price: 21700,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Bamboo Silk Blouse",
                ProductDescription: commonDescription,
                price: 12800,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Vegan Leather Skirt",
                ProductDescription: commonDescription,
                price: 34100,
                availability: "no",
                ProductBrief: commonBrief,
            },
        ],
        DesignerSocialMedia: [
            {
                icon: <FaFacebookF />,
                link: "https://www.facebook.com/avachenluxury",
            },
            {
                icon: <FaInstagram />,
                link: "https://www.instagram.com/avachenluxury",
            },
        ],
    },
    {
        slug: "elena-petrova",
        image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        DesignerName: "Elena Petrova",
        DesignerDescription: "Elena's collections are inspired by Russian royalty, featuring opulent fabrics and intricate beadwork.",
        DesignerProducts: [
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Beaded Velvet Gown",
                ProductDescription: commonDescription,
                price: 25600,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Fur-Trimmed Cape",
                ProductDescription: commonDescription,
                price: 38400,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Satin Brocade Dress",
                ProductDescription: commonDescription,
                price: 11200,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ProductName: "Embellished Headpiece",
                ProductDescription: commonDescription,
                price: 17500,
                availability: "no",
                ProductBrief: commonBrief,
            },
        ],
        DesignerSocialMedia: [
            {
                icon: <FaFacebookF />,
                link: "https://www.facebook.com/elenapetrova",
            },
            {
                icon: <FaInstagram />,
                link: "https://www.instagram.com/elenapetrova",
            },
        ],
    },

];

export default DesignerDummyData;