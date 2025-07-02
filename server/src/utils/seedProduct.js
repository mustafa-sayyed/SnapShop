import connectDB from "../db/index.js";
import connectCloudinary from "./cloudinary.js";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import "dotenv/config";
import { Product } from "../models/product.model.js";

const products = [
  {
    _id: "aaaaa",
    name: "Women Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 100,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223409/xoe10ho6bwij8lmjmiai.png",
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "aaaab",
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 200,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223411/k0l4dllugw9bknodoh23.png",
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223413/n6kpff5zi7ck0pya5dcf.png",
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223415/igaqhsgmtbj0xrxv0khw.png",
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223418/qoqigfa3ocrxez8dxc1z.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716621345448,
    bestseller: true,
  },
  {
    _id: "aaaac",
    name: "Girls Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 220,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223420/hce0gnlwikxt0rmec3fc.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "L", "XL"],
    date: 1716234545448,
    bestseller: true,
  },
  {
    _id: "aaaad",
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 110,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223422/leykazug3orckkdixzew.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "XXL"],
    date: 1716621345448,
    bestseller: true,
  },
  {
    _id: "aaaae",
    name: "Women Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 130,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223424/poreirrd8hzytg8ofrru.png",
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716622345448,
    bestseller: true,
  },
  {
    _id: "aaaaf",
    name: "Girls Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 140,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223426/twrzni6srvo0klrbwbg2.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "L", "XL"],
    date: 1716623423448,
    bestseller: true,
  },
  {
    _id: "aaaag",
    name: "Men Tapered Fit Flat-Front Trousers",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 190,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223428/se6fzksey8si4uows9ph.png",
    ],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "L", "XL"],
    date: 1716621542448,
    bestseller: false,
  },
  {
    _id: "aaaah",
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 140,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223430/a6yiydqoxacerh16ktmv.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716622345448,
    bestseller: false,
  },
  {
    _id: "aaaai",
    name: "Girls Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 100,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223433/vgxvg8a5g9kzart4vmxy.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716621235448,
    bestseller: false,
  },
  {
    _id: "aaaaj",
    name: "Men Tapered Fit Flat-Front Trousers",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 110,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223435/rsb7pvva8fzus5gogapl.png",
    ],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "L", "XL"],
    date: 1716622235448,
    bestseller: false,
  },
  {
    _id: "aaaak",
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 120,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223438/paapwanlortcnnr0ukbs.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716623345448,
    bestseller: false,
  },
  {
    _id: "aaaal",
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 150,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223440/pstq9hg4qrruk657d5hu.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716624445448,
    bestseller: false,
  },
  {
    _id: "aaaam",
    name: "Women Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 130,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223442/amovtpgn5jvdo9dpzbvo.png",
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716625545448,
    bestseller: false,
  },
  {
    _id: "aaaan",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 160,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223445/otp5wv8ifm0xcpxhfgmx.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716626645448,
    bestseller: false,
  },
  {
    _id: "aaaao",
    name: "Men Tapered Fit Flat-Front Trousers",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 140,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223447/dzimx4avxclaru9auf7s.png",
    ],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716627745448,
    bestseller: false,
  },
  {
    _id: "aaaap",
    name: "Girls Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 170,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223449/pp4a7hdmn6p7waubydtq.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716628845448,
    bestseller: false,
  },
  {
    _id: "aaaaq",
    name: "Men Tapered Fit Flat-Front Trousers",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 150,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223450/ki2cbvdfgroknrnnxjxu.png",
    ],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716629945448,
    bestseller: false,
  },
  {
    _id: "aaaar",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 180,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223452/iecsbdxt1fsamk4ezqym.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716631045448,
    bestseller: false,
  },
  {
    _id: "aaaas",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 160,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223453/oyfqyuvs14k4erqnkd9l.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716632145448,
    bestseller: false,
  },
  {
    _id: "aaaat",
    name: "Women Palazzo Pants with Waist Belt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 190,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223455/y4nzju9iqef59tf00dsi.png",
    ],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716633245448,
    bestseller: false,
  },
  {
    _id: "aaaau",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 170,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223457/nqfltkfcxt6vtr7fkbnl.png",
    ],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },
  {
    _id: "aaaav",
    name: "Women Palazzo Pants with Waist Belt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 200,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223459/lrzeipxxtvghidgdhxn5.png",
    ],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716635445448,
    bestseller: false,
  },
  {
    _id: "aaaaw",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 180,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223462/hdcrcg6pajnbbaivrxux.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716636545448,
    bestseller: false,
  },
  {
    _id: "aaaax",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 210,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223464/vgxnqpxzqfnkh69bi38f.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716637645448,
    bestseller: false,
  },
  {
    _id: "aaaay",
    name: "Girls Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 190,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223466/sgphxxpwtjvtrsdslvoc.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716638745448,
    bestseller: false,
  },
  {
    _id: "aaaaz",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 220,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223468/vdomtc82ifeuok0skjjc.png",
    ],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716639845448,
    bestseller: false,
  },
  {
    _id: "aaaba",
    name: "Girls Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 200,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223471/iug4jwl68wxwis4drqei.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716640945448,
    bestseller: false,
  },
  {
    _id: "aaabb",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 230,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223473/dpdfriidhl5m0cluumo0.png",
    ],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716642045448,
    bestseller: false,
  },
  {
    _id: "aaabc",
    name: "Women Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 210,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223474/o6dni7ekvar5fyxvqbcs.png",
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716643145448,
    bestseller: false,
  },
  {
    _id: "aaabd",
    name: "Girls Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 240,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223478/tyatizbdthnphuj2kbtz.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716644245448,
    bestseller: false,
  },
  {
    _id: "aaabe",
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 220,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223480/zgxkw53x1v54ruyxjbjm.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716645345448,
    bestseller: false,
  },
  {
    _id: "aaabf",
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 250,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223482/unpmwocorburubw06bb3.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716646445448,
    bestseller: false,
  },
  {
    _id: "aaabg",
    name: "Girls Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 230,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223484/aludofocqsfgiww6a8kf.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716647545448,
    bestseller: false,
  },
  {
    _id: "aaabh",
    name: "Women Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 260,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223486/jt2ugp6oy6ojy6wg5bxd.png",
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716648645448,
    bestseller: false,
  },
  {
    _id: "aaabi",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 240,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223488/kp4zvfewsuembm2yihjy.png",
    ],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716649745448,
    bestseller: false,
  },
  {
    _id: "aaabj",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 270,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223490/xe6yhvtygovx4aznxz28.png",
    ],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716650845448,
    bestseller: false,
  },
  {
    _id: "aaabk",
    name: "Women Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 250,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223492/nxf39utnzz5yljvy2wi5.png",
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716651945448,
    bestseller: false,
  },
  {
    _id: "aaabl",
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 280,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223494/gkkwdp7mjo4mxijgrdxa.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716653045448,
    bestseller: false,
  },
  {
    _id: "aaabm",
    name: "Men Printed Plain Cotton Shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 260,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223496/xox2qb3orq0go4mpngfv.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716654145448,
    bestseller: false,
  },
  {
    _id: "aaabn",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 290,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223501/nchhhaux1omi16wb0zgm.png",
    ],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716655245448,
    bestseller: false,
  },
  {
    _id: "aaabo",
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 270,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223503/dxypedoehfbboq52diuw.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716656345448,
    bestseller: false,
  },
  {
    _id: "aaabp",
    name: "Boy Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 300,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223504/by4frwd9ioix06vgdoht.png",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716657445448,
    bestseller: false,
  },
  {
    _id: "aaabq",
    name: "Kid Tapered Slim Fit Trouser",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 280,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223506/ub8aiednrccvo32whs0d.png",
    ],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716658545448,
    bestseller: false,
  },
  {
    _id: "aaabr",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 310,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223508/kjr7wwdfj2l35redourc.png",
    ],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716659645448,
    bestseller: false,
  },
  {
    _id: "aaabs",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 290,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223510/ljwusci56ovln4u1ayct.png",
    ],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716660745448,
    bestseller: false,
  },
  {
    _id: "aaabt",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 320,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223512/mj1li3ajcubrl9ispgrf.png",
    ],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716661845448,
    bestseller: false,
  },
  {
    _id: "aaabu",
    name: "Kid Tapered Slim Fit Trouser",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 300,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223513/ofnfkurx7539hlbxr48o.png",
    ],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716662945448,
    bestseller: false,
  },
  {
    _id: "aaabv",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 330,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223516/hrvkhkuxgesvzl8acnq8.png",
    ],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716664045448,
    bestseller: false,
  },
  {
    _id: "aaabw",
    name: "Kid Tapered Slim Fit Trouser",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 310,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223517/imp7wezywmm9lfjwhjoc.png",
    ],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716665145448,
    bestseller: false,
  },
  {
    _id: "aaabx",
    name: "Kid Tapered Slim Fit Trouser",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 340,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223519/duwjtntmaaigqxlhlrlx.png",
    ],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716666245448,
    bestseller: false,
  },
  {
    _id: "aaaby",
    name: "Women Zip-Front Relaxed Fit Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 320,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223521/cpqvsbfymft16chqeulg.png",
    ],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716667345448,
    bestseller: false,
  },
  {
    _id: "aaabz",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 350,
    image: [
      "https://res.cloudinary.com/dc0k40qjx/image/upload/v1751223523/ft9psofomyc5jequhd8s.png",
    ],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716668445448,
    bestseller: false,
  },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedProducts = async () => {
  try {
    // Uploading Images to Cloudinary from my local system
    // for (const product of products) {
    //   const imgURls = [];
    //   for (const imgUrl of product.image) {
    //     const imagePath = path.resolve(__dirname, imgUrl);
    //     const url = await cloudinary.uploader.upload(imagePath, {
    //       resource_type: "image",
    //     });
    //     imgURls.push(url.secure_url);
    //   }

    //   product.image = imgURls;
    //   console.log(product);
    // }

    // Uploading the data from the Array to the Database
    for (const product of products) {
      
      await Product.create({
        name: product.name,
        description: product.description,
        price: Number(product.price),
        image: product.image,
        category: product.category,
        subCategory: product.subCategory,
        sizes: product.sizes,
        bestSeller: product.bestseller,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export default seedProducts;
