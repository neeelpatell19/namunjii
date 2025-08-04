import { FaFacebookF, FaInstagram } from "react-icons/fa";

const commonDescription = (
    <div>
        <p>Handcrafted with precision in our exclusive atelier, this piece embodies timeless elegance and contemporary sophistication. Each detail is meticulously crafted using the finest materials, ensuring both comfort and luxury. The silhouette is designed to flatter every figure while maintaining the highest standards of bespoke tailoring.</p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Hand-stitched with premium silk thread</li>
            <li>Custom-fitted to your measurements</li>
            <li>Luxury fabric with natural stretch</li>
            <li>Reinforced seams for durability</li>
            <li>Adjustable waistband for perfect fit</li>
            <li>Includes complimentary alterations</li>
        </ul>
    </div>
);

const commonBrief = (
    <div>
        <p>Handcrafted with precision in our exclusive atelier, this piece embodies timeless elegance and contemporary sophistication. Each detail is meticulously crafted using the finest materials, ensuring both comfort and luxury.</p>
        <br />
        <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Hand-stitched with premium silk thread</li>
            <li>Custom-fitted to your measurements</li>
            <li>Luxury fabric with natural stretch</li>
            <li>Reinforced seams for durability</li>
            <li>Adjustable waistband for perfect fit</li>
            <li>Includes complimentary alterations</li>
        </ul>
    </div>
);

const DesignerDummyData = [
    {
        slug: "Wabi-Sabi",
        image: ["https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_2803.jpeg", "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_2803.jpeg",],
        DesignerName: "Wabi-Sabi",
        DesignerDescription: "Isabella crafts timeless couture with a modern twist, specializing in silk evening gowns and bespoke luxury pieces.",
        DesignerProducts: [
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Bespoke Silk Evening Gown",
                ProductDescription: commonDescription,
                price: 18500,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Crystal-Embellished Cape Dress",
                ProductDescription: commonDescription,
                price: 23750,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Velvet Cocktail Dress",
                ProductDescription: commonDescription,
                price: 31200,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
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
        slug: "Greyhorn",
        image: [
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_2789.jpeg",
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_2789.jpeg",
        ],
        DesignerName: "Greyhorn",
        DesignerDescription: "Elena's collections are inspired by Russian royalty, featuring opulent fabrics and intricate beadwork.",
        DesignerProducts: [
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Beaded Velvet Bespoke Gown",
                ProductDescription: commonDescription,
                price: 25600,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Fur-Trimmed Bespoke Cape",
                ProductDescription: commonDescription,
                price: 38400,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Satin Brocade Bespoke Dress",
                ProductDescription: commonDescription,
                price: 11200,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Embellished Bespoke Headpiece",
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
    {
        slug: "luca-moretti",
        image: [
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_2993.jpeg",
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_2993.jpeg",
        ],
        DesignerName: "Luca Moretti",
        DesignerDescription: "Luca is renowned for his Italian craftsmanship, blending classic tailoring with avant-garde luxury fabrics.",
        DesignerProducts: [
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Bespoke Cashmere Overcoat",
                ProductDescription: commonDescription,
                price: 22100,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Wool-Blend Bespoke Suit",
                ProductDescription: commonDescription,
                price: 39800,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Silk-Lined Tuxedo",
                ProductDescription: commonDescription,
                price: 17600,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
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
        image: [
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_2996.jpeg",
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_2996.jpeg",
        ],
        DesignerName: "Sophie Dubois",
        DesignerDescription: "Sophie is a Parisian designer celebrated for her haute couture dresses and luxury ready-to-wear collections.",
        DesignerProducts: [
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Bespoke Chiffon Ball Gown",
                ProductDescription: commonDescription,
                price: 31200,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Embroidered Mini Dress",
                ProductDescription: commonDescription,
                price: 14500,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Feathered Cape Dress",
                ProductDescription: commonDescription,
                price: 25600,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
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
        image: [
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/Demo1.jpeg",
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/Demo1.jpeg",
        ],
        DesignerName: "Mateo García",
        DesignerDescription: "Mateo fuses Spanish tradition with modern luxury, known for his bold prints and opulent fabrics.",
        DesignerProducts: [
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Baroque Print Bespoke Blazer",
                ProductDescription: commonDescription,
                price: 27700,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Velvet Bespoke Trousers",
                ProductDescription: commonDescription,
                price: 19100,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Embroidered Kimono Jacket",
                ProductDescription: commonDescription,
                price: 36200,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Silk Bespoke Scarf",
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
        image: [
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_3563.jpeg",
            "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/IMG_3563.jpeg",
        ],
        DesignerName: "Ava Chen",
        DesignerDescription: "Ava is a pioneer in sustainable luxury, creating eco-friendly couture with a focus on organic materials.",
        DesignerProducts: [
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Organic Cotton Bespoke Dress",
                ProductDescription: commonDescription,
                price: 39900,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Recycled Wool Bespoke Coat",
                ProductDescription: commonDescription,
                price: 21700,
                availability: "no",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Bamboo Silk Bespoke Blouse",
                ProductDescription: commonDescription,
                price: 12800,
                availability: "yes",
                ProductBrief: commonBrief,
            },
            {
                image: [
                    "https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ],
                ProductName: "Vegan Leather Bespoke Skirt",
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


];

const CollectionData = [
    {
        CollectionTitle: "Collection 1",
    },
    {
        CollectionTitle: "Collection 2",
    },
    {
        CollectionTitle: "Collection 3",
    },
    {
        CollectionTitle: "Collection 4",
    },
]

export { DesignerDummyData, CollectionData };   
