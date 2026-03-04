"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Clock, Smile } from "lucide-react";
import { toast } from "sonner";

interface EmojiData {
  emoji: string;
  name: string;
  category: string;
}

const RECENT_KEY = "bt_emoji_recent";
const MAX_RECENT = 20;

const SKIN_TONES = [
  { label: "Default", suffix: "" },
  { label: "Light", suffix: "🏻" },
  { label: "Medium-Light", suffix: "🏼" },
  { label: "Medium", suffix: "🏽" },
  { label: "Medium-Dark", suffix: "🏾" },
  { label: "Dark", suffix: "🏿" },
];

const SKIN_TONE_EMOJIS = new Set([
  "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤙", "💪", "🦾",
  "🖕", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🫶", "🤝",
  "🙏", "✍️", "💅", "🤳", "💪", "🦵", "🦶", "👂", "🦻", "👃", "🫀", "🫁", "🦷", "🦴",
  "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "👩", "🧔", "🧓", "👴", "👵", "🙍", "🙎",
  "🙅", "🙆", "💁", "🙋", "🧏", "🙇", "🤦", "🤷", "💆", "💇", "🚶", "🧍", "🧎", "🏃",
  "💃", "🕺", "🧖", "🧗", "🏇", "🏂", "🏌", "🏄", "🚣", "🧘", "🛀", "🛌",
]);

const ALL_EMOJIS: EmojiData[] = [
  // Smileys
  { emoji: "😀", name: "grinning face", category: "Smileys" },
  { emoji: "😃", name: "grinning face with big eyes", category: "Smileys" },
  { emoji: "😄", name: "grinning face with smiling eyes", category: "Smileys" },
  { emoji: "😁", name: "beaming face with smiling eyes", category: "Smileys" },
  { emoji: "😆", name: "grinning squinting face", category: "Smileys" },
  { emoji: "😅", name: "grinning face with sweat", category: "Smileys" },
  { emoji: "🤣", name: "rolling on the floor laughing", category: "Smileys" },
  { emoji: "😂", name: "face with tears of joy", category: "Smileys" },
  { emoji: "🙂", name: "slightly smiling face", category: "Smileys" },
  { emoji: "🙃", name: "upside down face", category: "Smileys" },
  { emoji: "🫠", name: "melting face", category: "Smileys" },
  { emoji: "😉", name: "winking face", category: "Smileys" },
  { emoji: "😊", name: "smiling face with smiling eyes", category: "Smileys" },
  { emoji: "😇", name: "smiling face with halo", category: "Smileys" },
  { emoji: "🥰", name: "smiling face with hearts", category: "Smileys" },
  { emoji: "😍", name: "smiling face with heart eyes", category: "Smileys" },
  { emoji: "🤩", name: "star struck", category: "Smileys" },
  { emoji: "😘", name: "face blowing a kiss", category: "Smileys" },
  { emoji: "😗", name: "kissing face", category: "Smileys" },
  { emoji: "😚", name: "kissing face with closed eyes", category: "Smileys" },
  { emoji: "😙", name: "kissing face with smiling eyes", category: "Smileys" },
  { emoji: "🥲", name: "smiling face with tear", category: "Smileys" },
  { emoji: "😏", name: "smirking face", category: "Smileys" },
  { emoji: "😒", name: "unamused face", category: "Smileys" },
  { emoji: "🙄", name: "face with rolling eyes", category: "Smileys" },
  { emoji: "😬", name: "grimacing face", category: "Smileys" },
  { emoji: "🤥", name: "lying face", category: "Smileys" },
  { emoji: "😌", name: "relieved face", category: "Smileys" },
  { emoji: "😔", name: "pensive face", category: "Smileys" },
  { emoji: "😪", name: "sleepy face", category: "Smileys" },
  { emoji: "🤤", name: "drooling face", category: "Smileys" },
  { emoji: "😴", name: "sleeping face", category: "Smileys" },
  { emoji: "😷", name: "face with medical mask", category: "Smileys" },
  { emoji: "🤒", name: "face with thermometer", category: "Smileys" },
  { emoji: "🤕", name: "face with head bandage", category: "Smileys" },
  { emoji: "🤢", name: "nauseated face", category: "Smileys" },
  { emoji: "🤮", name: "face vomiting", category: "Smileys" },
  { emoji: "🤧", name: "sneezing face", category: "Smileys" },
  { emoji: "🥵", name: "hot face", category: "Smileys" },
  { emoji: "🥶", name: "cold face", category: "Smileys" },
  { emoji: "🥴", name: "woozy face", category: "Smileys" },
  { emoji: "😵", name: "dizzy face", category: "Smileys" },
  { emoji: "🤯", name: "exploding head", category: "Smileys" },
  { emoji: "🤠", name: "cowboy hat face", category: "Smileys" },
  { emoji: "🥳", name: "partying face", category: "Smileys" },
  { emoji: "🥸", name: "disguised face", category: "Smileys" },
  { emoji: "😎", name: "smiling face with sunglasses", category: "Smileys" },
  { emoji: "🤓", name: "nerd face", category: "Smileys" },
  { emoji: "🧐", name: "face with monocle", category: "Smileys" },
  { emoji: "😕", name: "confused face", category: "Smileys" },
  { emoji: "🫤", name: "face with diagonal mouth", category: "Smileys" },
  { emoji: "😟", name: "worried face", category: "Smileys" },
  { emoji: "🙁", name: "slightly frowning face", category: "Smileys" },
  { emoji: "☹️", name: "frowning face", category: "Smileys" },
  { emoji: "😮", name: "face with open mouth", category: "Smileys" },
  { emoji: "😯", name: "hushed face", category: "Smileys" },
  { emoji: "😲", name: "astonished face", category: "Smileys" },
  { emoji: "😳", name: "flushed face", category: "Smileys" },
  { emoji: "🥺", name: "pleading face", category: "Smileys" },
  { emoji: "😦", name: "frowning face with open mouth", category: "Smileys" },
  { emoji: "😧", name: "anguished face", category: "Smileys" },
  { emoji: "😨", name: "fearful face", category: "Smileys" },
  { emoji: "😰", name: "anxious face with sweat", category: "Smileys" },
  { emoji: "😥", name: "sad but relieved face", category: "Smileys" },
  { emoji: "😢", name: "crying face", category: "Smileys" },
  { emoji: "😭", name: "loudly crying face", category: "Smileys" },
  { emoji: "😱", name: "face screaming in fear", category: "Smileys" },
  { emoji: "😖", name: "confounded face", category: "Smileys" },
  { emoji: "😣", name: "persevering face", category: "Smileys" },
  { emoji: "😞", name: "disappointed face", category: "Smileys" },
  { emoji: "😓", name: "downcast face with sweat", category: "Smileys" },
  { emoji: "😩", name: "weary face", category: "Smileys" },
  { emoji: "😫", name: "tired face", category: "Smileys" },
  { emoji: "🥱", name: "yawning face", category: "Smileys" },
  { emoji: "😤", name: "face with steam from nose", category: "Smileys" },
  { emoji: "😡", name: "pouting face", category: "Smileys" },
  { emoji: "😠", name: "angry face", category: "Smileys" },
  { emoji: "🤬", name: "face with symbols on mouth", category: "Smileys" },
  { emoji: "😈", name: "smiling face with horns", category: "Smileys" },
  { emoji: "👿", name: "angry face with horns", category: "Smileys" },
  { emoji: "💀", name: "skull", category: "Smileys" },
  { emoji: "☠️", name: "skull and crossbones", category: "Smileys" },
  { emoji: "💩", name: "pile of poo", category: "Smileys" },
  { emoji: "🤡", name: "clown face", category: "Smileys" },
  { emoji: "👹", name: "ogre", category: "Smileys" },
  { emoji: "👺", name: "goblin", category: "Smileys" },
  { emoji: "👻", name: "ghost", category: "Smileys" },
  { emoji: "👽", name: "alien", category: "Smileys" },
  { emoji: "🤖", name: "robot", category: "Smileys" },
  { emoji: "😺", name: "grinning cat", category: "Smileys" },
  { emoji: "😸", name: "grinning cat with smiling eyes", category: "Smileys" },
  { emoji: "😹", name: "cat with tears of joy", category: "Smileys" },
  { emoji: "😻", name: "smiling cat with heart eyes", category: "Smileys" },
  { emoji: "😼", name: "cat with wry smile", category: "Smileys" },
  { emoji: "😽", name: "kissing cat", category: "Smileys" },
  { emoji: "🙀", name: "weary cat", category: "Smileys" },
  { emoji: "😿", name: "crying cat", category: "Smileys" },
  { emoji: "😾", name: "pouting cat", category: "Smileys" },

  // People
  { emoji: "👋", name: "waving hand", category: "People" },
  { emoji: "🤚", name: "raised back of hand", category: "People" },
  { emoji: "✋", name: "raised hand", category: "People" },
  { emoji: "👌", name: "OK hand", category: "People" },
  { emoji: "✌️", name: "victory hand", category: "People" },
  { emoji: "🤞", name: "crossed fingers", category: "People" },
  { emoji: "🤙", name: "call me hand", category: "People" },
  { emoji: "👍", name: "thumbs up", category: "People" },
  { emoji: "👎", name: "thumbs down", category: "People" },
  { emoji: "👊", name: "oncoming fist", category: "People" },
  { emoji: "✊", name: "raised fist", category: "People" },
  { emoji: "👏", name: "clapping hands", category: "People" },
  { emoji: "🙌", name: "raising hands", category: "People" },
  { emoji: "🤲", name: "palms up together", category: "People" },
  { emoji: "🤝", name: "handshake", category: "People" },
  { emoji: "🙏", name: "folded hands", category: "People" },
  { emoji: "💅", name: "nail polish", category: "People" },
  { emoji: "💪", name: "flexed biceps", category: "People" },
  { emoji: "🦵", name: "leg", category: "People" },
  { emoji: "🦶", name: "foot", category: "People" },
  { emoji: "👁️", name: "eye", category: "People" },
  { emoji: "👅", name: "tongue", category: "People" },
  { emoji: "💋", name: "kiss mark", category: "People" },
  { emoji: "👶", name: "baby", category: "People" },
  { emoji: "🧒", name: "child", category: "People" },
  { emoji: "👦", name: "boy", category: "People" },
  { emoji: "👧", name: "girl", category: "People" },
  { emoji: "🧑", name: "person", category: "People" },
  { emoji: "👨", name: "man", category: "People" },
  { emoji: "👩", name: "woman", category: "People" },
  { emoji: "🧓", name: "older person", category: "People" },
  { emoji: "👴", name: "old man", category: "People" },
  { emoji: "👵", name: "old woman", category: "People" },
  { emoji: "👮", name: "police officer", category: "People" },
  { emoji: "🧑‍⚕️", name: "health worker", category: "People" },
  { emoji: "🧑‍🏫", name: "teacher", category: "People" },
  { emoji: "🧑‍🍳", name: "cook", category: "People" },
  { emoji: "🧑‍🔧", name: "mechanic", category: "People" },
  { emoji: "🧑‍💻", name: "technologist", category: "People" },
  { emoji: "🧑‍🎨", name: "artist", category: "People" },
  { emoji: "🧑‍🚀", name: "astronaut", category: "People" },
  { emoji: "🧑‍🚒", name: "firefighter", category: "People" },
  { emoji: "💑", name: "couple with heart", category: "People" },
  { emoji: "👨‍👩‍👦", name: "family", category: "People" },
  { emoji: "🗣️", name: "speaking head", category: "People" },
  { emoji: "💏", name: "kiss", category: "People" },

  // Animals
  { emoji: "🐶", name: "dog face", category: "Animals" },
  { emoji: "🐱", name: "cat face", category: "Animals" },
  { emoji: "🐭", name: "mouse face", category: "Animals" },
  { emoji: "🐹", name: "hamster", category: "Animals" },
  { emoji: "🐰", name: "rabbit face", category: "Animals" },
  { emoji: "🦊", name: "fox", category: "Animals" },
  { emoji: "🐻", name: "bear", category: "Animals" },
  { emoji: "🐼", name: "panda", category: "Animals" },
  { emoji: "🐨", name: "koala", category: "Animals" },
  { emoji: "🐯", name: "tiger face", category: "Animals" },
  { emoji: "🦁", name: "lion", category: "Animals" },
  { emoji: "🐮", name: "cow face", category: "Animals" },
  { emoji: "🐷", name: "pig face", category: "Animals" },
  { emoji: "🐸", name: "frog", category: "Animals" },
  { emoji: "🐵", name: "monkey face", category: "Animals" },
  { emoji: "🙈", name: "see-no-evil monkey", category: "Animals" },
  { emoji: "🙉", name: "hear-no-evil monkey", category: "Animals" },
  { emoji: "🙊", name: "speak-no-evil monkey", category: "Animals" },
  { emoji: "🐔", name: "chicken", category: "Animals" },
  { emoji: "🐧", name: "penguin", category: "Animals" },
  { emoji: "🐦", name: "bird", category: "Animals" },
  { emoji: "🐤", name: "baby chick", category: "Animals" },
  { emoji: "🦆", name: "duck", category: "Animals" },
  { emoji: "🦅", name: "eagle", category: "Animals" },
  { emoji: "🦉", name: "owl", category: "Animals" },
  { emoji: "🦇", name: "bat", category: "Animals" },
  { emoji: "🐺", name: "wolf", category: "Animals" },
  { emoji: "🐗", name: "boar", category: "Animals" },
  { emoji: "🐴", name: "horse face", category: "Animals" },
  { emoji: "🦄", name: "unicorn", category: "Animals" },
  { emoji: "🐝", name: "honeybee", category: "Animals" },
  { emoji: "🐛", name: "bug", category: "Animals" },
  { emoji: "🦋", name: "butterfly", category: "Animals" },
  { emoji: "🐌", name: "snail", category: "Animals" },
  { emoji: "🐞", name: "lady beetle", category: "Animals" },
  { emoji: "🐜", name: "ant", category: "Animals" },
  { emoji: "🦟", name: "mosquito", category: "Animals" },
  { emoji: "🦎", name: "lizard", category: "Animals" },
  { emoji: "🐍", name: "snake", category: "Animals" },
  { emoji: "🦕", name: "sauropod", category: "Animals" },
  { emoji: "🦖", name: "T-Rex", category: "Animals" },
  { emoji: "🐙", name: "octopus", category: "Animals" },
  { emoji: "🦑", name: "squid", category: "Animals" },
  { emoji: "🦐", name: "shrimp", category: "Animals" },
  { emoji: "🦞", name: "lobster", category: "Animals" },
  { emoji: "🦀", name: "crab", category: "Animals" },
  { emoji: "🐡", name: "blowfish", category: "Animals" },
  { emoji: "🐠", name: "tropical fish", category: "Animals" },
  { emoji: "🐟", name: "fish", category: "Animals" },
  { emoji: "🐬", name: "dolphin", category: "Animals" },
  { emoji: "🐳", name: "whale", category: "Animals" },
  { emoji: "🦈", name: "shark", category: "Animals" },
  { emoji: "🐊", name: "crocodile", category: "Animals" },
  { emoji: "🐢", name: "turtle", category: "Animals" },
  { emoji: "🦒", name: "giraffe", category: "Animals" },
  { emoji: "🦘", name: "kangaroo", category: "Animals" },
  { emoji: "🦣", name: "mammoth", category: "Animals" },
  { emoji: "🐘", name: "elephant", category: "Animals" },
  { emoji: "🦏", name: "rhinoceros", category: "Animals" },
  { emoji: "🦛", name: "hippopotamus", category: "Animals" },
  { emoji: "🐿️", name: "chipmunk", category: "Animals" },
  { emoji: "🦔", name: "hedgehog", category: "Animals" },

  // Food
  { emoji: "🍎", name: "red apple", category: "Food" },
  { emoji: "🍊", name: "tangerine", category: "Food" },
  { emoji: "🍋", name: "lemon", category: "Food" },
  { emoji: "🍇", name: "grapes", category: "Food" },
  { emoji: "🍓", name: "strawberry", category: "Food" },
  { emoji: "🫐", name: "blueberries", category: "Food" },
  { emoji: "🍈", name: "melon", category: "Food" },
  { emoji: "🍉", name: "watermelon", category: "Food" },
  { emoji: "🍑", name: "peach", category: "Food" },
  { emoji: "🍒", name: "cherries", category: "Food" },
  { emoji: "🍍", name: "pineapple", category: "Food" },
  { emoji: "🥭", name: "mango", category: "Food" },
  { emoji: "🥥", name: "coconut", category: "Food" },
  { emoji: "🥝", name: "kiwi fruit", category: "Food" },
  { emoji: "🍅", name: "tomato", category: "Food" },
  { emoji: "🫒", name: "olive", category: "Food" },
  { emoji: "🥑", name: "avocado", category: "Food" },
  { emoji: "🍆", name: "eggplant", category: "Food" },
  { emoji: "🥦", name: "broccoli", category: "Food" },
  { emoji: "🌽", name: "ear of corn", category: "Food" },
  { emoji: "🌶️", name: "hot pepper", category: "Food" },
  { emoji: "🥕", name: "carrot", category: "Food" },
  { emoji: "🧄", name: "garlic", category: "Food" },
  { emoji: "🧅", name: "onion", category: "Food" },
  { emoji: "🥔", name: "potato", category: "Food" },
  { emoji: "🍕", name: "pizza", category: "Food" },
  { emoji: "🍔", name: "hamburger", category: "Food" },
  { emoji: "🌮", name: "taco", category: "Food" },
  { emoji: "🌯", name: "burrito", category: "Food" },
  { emoji: "🫔", name: "tamale", category: "Food" },
  { emoji: "🥗", name: "green salad", category: "Food" },
  { emoji: "🍜", name: "steaming bowl", category: "Food" },
  { emoji: "🍣", name: "sushi", category: "Food" },
  { emoji: "🍱", name: "bento box", category: "Food" },
  { emoji: "🍩", name: "doughnut", category: "Food" },
  { emoji: "🍪", name: "cookie", category: "Food" },
  { emoji: "🎂", name: "birthday cake", category: "Food" },
  { emoji: "🍰", name: "shortcake", category: "Food" },
  { emoji: "🧁", name: "cupcake", category: "Food" },
  { emoji: "🍫", name: "chocolate bar", category: "Food" },
  { emoji: "🍿", name: "popcorn", category: "Food" },
  { emoji: "☕", name: "hot beverage", category: "Food" },
  { emoji: "🍵", name: "teacup without handle", category: "Food" },
  { emoji: "🧃", name: "beverage box", category: "Food" },
  { emoji: "🥤", name: "cup with straw", category: "Food" },
  { emoji: "🍺", name: "beer mug", category: "Food" },
  { emoji: "🍷", name: "wine glass", category: "Food" },
  { emoji: "🍾", name: "bottle with popping cork", category: "Food" },

  // Travel
  { emoji: "🚗", name: "automobile", category: "Travel" },
  { emoji: "🚕", name: "taxi", category: "Travel" },
  { emoji: "🚙", name: "sport utility vehicle", category: "Travel" },
  { emoji: "🚌", name: "bus", category: "Travel" },
  { emoji: "🚎", name: "trolleybus", category: "Travel" },
  { emoji: "🏎️", name: "racing car", category: "Travel" },
  { emoji: "🚓", name: "police car", category: "Travel" },
  { emoji: "🚑", name: "ambulance", category: "Travel" },
  { emoji: "🚒", name: "fire engine", category: "Travel" },
  { emoji: "🚐", name: "minibus", category: "Travel" },
  { emoji: "🚚", name: "delivery truck", category: "Travel" },
  { emoji: "🚂", name: "locomotive", category: "Travel" },
  { emoji: "✈️", name: "airplane", category: "Travel" },
  { emoji: "🚀", name: "rocket", category: "Travel" },
  { emoji: "🛸", name: "flying saucer", category: "Travel" },
  { emoji: "🚁", name: "helicopter", category: "Travel" },
  { emoji: "⛵", name: "sailboat", category: "Travel" },
  { emoji: "🚢", name: "ship", category: "Travel" },
  { emoji: "🏖️", name: "beach with umbrella", category: "Travel" },
  { emoji: "🏔️", name: "snow-capped mountain", category: "Travel" },
  { emoji: "🗻", name: "mount fuji", category: "Travel" },
  { emoji: "🏕️", name: "camping", category: "Travel" },
  { emoji: "🏝️", name: "desert island", category: "Travel" },
  { emoji: "🗼", name: "Tokyo tower", category: "Travel" },
  { emoji: "🗽", name: "Statue of Liberty", category: "Travel" },
  { emoji: "🏰", name: "castle", category: "Travel" },
  { emoji: "🗺️", name: "world map", category: "Travel" },
  { emoji: "🧭", name: "compass", category: "Travel" },
  { emoji: "⛽", name: "fuel pump", category: "Travel" },
  { emoji: "🛞", name: "wheel", category: "Travel" },

  // Activities
  { emoji: "⚽", name: "soccer ball", category: "Activities" },
  { emoji: "🏀", name: "basketball", category: "Activities" },
  { emoji: "🏈", name: "american football", category: "Activities" },
  { emoji: "⚾", name: "baseball", category: "Activities" },
  { emoji: "🥎", name: "softball", category: "Activities" },
  { emoji: "🎾", name: "tennis", category: "Activities" },
  { emoji: "🏐", name: "volleyball", category: "Activities" },
  { emoji: "🏉", name: "rugby football", category: "Activities" },
  { emoji: "🎱", name: "pool 8 ball", category: "Activities" },
  { emoji: "🏓", name: "ping pong", category: "Activities" },
  { emoji: "🏸", name: "badminton", category: "Activities" },
  { emoji: "🥊", name: "boxing glove", category: "Activities" },
  { emoji: "🥋", name: "martial arts uniform", category: "Activities" },
  { emoji: "🎿", name: "skis", category: "Activities" },
  { emoji: "⛸️", name: "ice skate", category: "Activities" },
  { emoji: "🛹", name: "skateboard", category: "Activities" },
  { emoji: "🛼", name: "roller skate", category: "Activities" },
  { emoji: "🎯", name: "bullseye", category: "Activities" },
  { emoji: "🎮", name: "video game", category: "Activities" },
  { emoji: "🎲", name: "game die", category: "Activities" },
  { emoji: "♟️", name: "chess pawn", category: "Activities" },
  { emoji: "🎰", name: "slot machine", category: "Activities" },
  { emoji: "🧩", name: "puzzle piece", category: "Activities" },
  { emoji: "🎭", name: "performing arts", category: "Activities" },
  { emoji: "🎨", name: "artist palette", category: "Activities" },
  { emoji: "🎬", name: "clapper board", category: "Activities" },
  { emoji: "🎤", name: "microphone", category: "Activities" },
  { emoji: "🎸", name: "guitar", category: "Activities" },
  { emoji: "🎹", name: "musical keyboard", category: "Activities" },
  { emoji: "🥁", name: "drum", category: "Activities" },
  { emoji: "🎷", name: "saxophone", category: "Activities" },
  { emoji: "🎻", name: "violin", category: "Activities" },
  { emoji: "🏋️", name: "person lifting weights", category: "Activities" },
  { emoji: "🤸", name: "person cartwheeling", category: "Activities" },
  { emoji: "🧗", name: "person climbing", category: "Activities" },

  // Objects
  { emoji: "💡", name: "light bulb", category: "Objects" },
  { emoji: "🔦", name: "flashlight", category: "Objects" },
  { emoji: "📱", name: "mobile phone", category: "Objects" },
  { emoji: "💻", name: "laptop", category: "Objects" },
  { emoji: "🖥️", name: "desktop computer", category: "Objects" },
  { emoji: "⌨️", name: "keyboard", category: "Objects" },
  { emoji: "🖱️", name: "computer mouse", category: "Objects" },
  { emoji: "🖨️", name: "printer", category: "Objects" },
  { emoji: "📷", name: "camera", category: "Objects" },
  { emoji: "📸", name: "camera with flash", category: "Objects" },
  { emoji: "📺", name: "television", category: "Objects" },
  { emoji: "📻", name: "radio", category: "Objects" },
  { emoji: "📞", name: "telephone receiver", category: "Objects" },
  { emoji: "⌚", name: "watch", category: "Objects" },
  { emoji: "⏰", name: "alarm clock", category: "Objects" },
  { emoji: "🕰️", name: "mantelpiece clock", category: "Objects" },
  { emoji: "📚", name: "books", category: "Objects" },
  { emoji: "📖", name: "open book", category: "Objects" },
  { emoji: "📝", name: "memo", category: "Objects" },
  { emoji: "✏️", name: "pencil", category: "Objects" },
  { emoji: "🔬", name: "microscope", category: "Objects" },
  { emoji: "🔭", name: "telescope", category: "Objects" },
  { emoji: "🧪", name: "test tube", category: "Objects" },
  { emoji: "🧲", name: "magnet", category: "Objects" },
  { emoji: "🔧", name: "wrench", category: "Objects" },
  { emoji: "🔨", name: "hammer", category: "Objects" },
  { emoji: "⚙️", name: "gear", category: "Objects" },
  { emoji: "🔒", name: "locked", category: "Objects" },
  { emoji: "🔑", name: "key", category: "Objects" },
  { emoji: "🗝️", name: "old key", category: "Objects" },
  { emoji: "💊", name: "pill", category: "Objects" },
  { emoji: "💉", name: "syringe", category: "Objects" },
  { emoji: "🧬", name: "DNA", category: "Objects" },
  { emoji: "💰", name: "money bag", category: "Objects" },
  { emoji: "💳", name: "credit card", category: "Objects" },
  { emoji: "🎁", name: "wrapped gift", category: "Objects" },
  { emoji: "🎀", name: "ribbon", category: "Objects" },
  { emoji: "🛒", name: "shopping cart", category: "Objects" },
  { emoji: "🛍️", name: "shopping bags", category: "Objects" },
  { emoji: "🏠", name: "house", category: "Objects" },
  { emoji: "🏢", name: "office building", category: "Objects" },

  // Symbols
  { emoji: "❤️", name: "red heart", category: "Symbols" },
  { emoji: "🧡", name: "orange heart", category: "Symbols" },
  { emoji: "💛", name: "yellow heart", category: "Symbols" },
  { emoji: "💚", name: "green heart", category: "Symbols" },
  { emoji: "💙", name: "blue heart", category: "Symbols" },
  { emoji: "💜", name: "purple heart", category: "Symbols" },
  { emoji: "🖤", name: "black heart", category: "Symbols" },
  { emoji: "🤍", name: "white heart", category: "Symbols" },
  { emoji: "🤎", name: "brown heart", category: "Symbols" },
  { emoji: "💔", name: "broken heart", category: "Symbols" },
  { emoji: "❣️", name: "heart exclamation", category: "Symbols" },
  { emoji: "💕", name: "two hearts", category: "Symbols" },
  { emoji: "💞", name: "revolving hearts", category: "Symbols" },
  { emoji: "💓", name: "beating heart", category: "Symbols" },
  { emoji: "💗", name: "growing heart", category: "Symbols" },
  { emoji: "💖", name: "sparkling heart", category: "Symbols" },
  { emoji: "💘", name: "heart with arrow", category: "Symbols" },
  { emoji: "💝", name: "heart with ribbon", category: "Symbols" },
  { emoji: "💟", name: "heart decoration", category: "Symbols" },
  { emoji: "☮️", name: "peace symbol", category: "Symbols" },
  { emoji: "✝️", name: "latin cross", category: "Symbols" },
  { emoji: "☯️", name: "yin yang", category: "Symbols" },
  { emoji: "⭐", name: "star", category: "Symbols" },
  { emoji: "🌟", name: "glowing star", category: "Symbols" },
  { emoji: "💫", name: "dizzy", category: "Symbols" },
  { emoji: "✨", name: "sparkles", category: "Symbols" },
  { emoji: "🎉", name: "party popper", category: "Symbols" },
  { emoji: "🎊", name: "confetti ball", category: "Symbols" },
  { emoji: "🎈", name: "balloon", category: "Symbols" },
  { emoji: "🎆", name: "fireworks", category: "Symbols" },
  { emoji: "🎇", name: "sparkler", category: "Symbols" },
  { emoji: "🔥", name: "fire", category: "Symbols" },
  { emoji: "💧", name: "droplet", category: "Symbols" },
  { emoji: "🌊", name: "water wave", category: "Symbols" },
  { emoji: "⚡", name: "high voltage", category: "Symbols" },
  { emoji: "❄️", name: "snowflake", category: "Symbols" },
  { emoji: "🌈", name: "rainbow", category: "Symbols" },
  { emoji: "☀️", name: "sun", category: "Symbols" },
  { emoji: "🌙", name: "crescent moon", category: "Symbols" },
  { emoji: "⚠️", name: "warning", category: "Symbols" },
  { emoji: "♻️", name: "recycling symbol", category: "Symbols" },
  { emoji: "✅", name: "check mark button", category: "Symbols" },
  { emoji: "❌", name: "cross mark", category: "Symbols" },
  { emoji: "❓", name: "question mark", category: "Symbols" },
  { emoji: "❗", name: "exclamation mark", category: "Symbols" },
  { emoji: "🔴", name: "red circle", category: "Symbols" },
  { emoji: "🟡", name: "yellow circle", category: "Symbols" },
  { emoji: "🟢", name: "green circle", category: "Symbols" },
  { emoji: "🔵", name: "blue circle", category: "Symbols" },
  { emoji: "🟣", name: "purple circle", category: "Symbols" },
  { emoji: "⚫", name: "black circle", category: "Symbols" },
  { emoji: "⚪", name: "white circle", category: "Symbols" },

  // Flags
  { emoji: "🏳️", name: "white flag", category: "Flags" },
  { emoji: "🏴", name: "black flag", category: "Flags" },
  { emoji: "🚩", name: "triangular flag", category: "Flags" },
  { emoji: "🏁", name: "chequered flag", category: "Flags" },
  { emoji: "🏴‍☠️", name: "pirate flag", category: "Flags" },
  { emoji: "🌐", name: "globe with meridians", category: "Flags" },
  { emoji: "🗾", name: "map of Japan", category: "Flags" },
  { emoji: "🌍", name: "globe showing Europe-Africa", category: "Flags" },
  { emoji: "🌎", name: "globe showing Americas", category: "Flags" },
  { emoji: "🌏", name: "globe showing Asia-Australia", category: "Flags" },
  { emoji: "🇺🇸", name: "flag United States", category: "Flags" },
  { emoji: "🇬🇧", name: "flag United Kingdom", category: "Flags" },
  { emoji: "🇪🇺", name: "flag European Union", category: "Flags" },
  { emoji: "🇨🇦", name: "flag Canada", category: "Flags" },
  { emoji: "🇦🇺", name: "flag Australia", category: "Flags" },
  { emoji: "🇩🇪", name: "flag Germany", category: "Flags" },
  { emoji: "🇫🇷", name: "flag France", category: "Flags" },
  { emoji: "🇯🇵", name: "flag Japan", category: "Flags" },
  { emoji: "🇰🇷", name: "flag South Korea", category: "Flags" },
  { emoji: "🇮🇳", name: "flag India", category: "Flags" },
  { emoji: "🇧🇷", name: "flag Brazil", category: "Flags" },
  { emoji: "🇲🇽", name: "flag Mexico", category: "Flags" },
  { emoji: "🇨🇳", name: "flag China", category: "Flags" },
  { emoji: "🇷🇺", name: "flag Russia", category: "Flags" },
  { emoji: "🇿🇦", name: "flag South Africa", category: "Flags" },
  { emoji: "🇳🇬", name: "flag Nigeria", category: "Flags" },
  { emoji: "🇦🇷", name: "flag Argentina", category: "Flags" },
  { emoji: "🇮🇹", name: "flag Italy", category: "Flags" },
  { emoji: "🇪🇸", name: "flag Spain", category: "Flags" },
  { emoji: "🇸🇦", name: "flag Saudi Arabia", category: "Flags" },
];

const CATEGORIES = ["Smileys", "People", "Animals", "Food", "Travel", "Activities", "Objects", "Symbols", "Flags"];

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRecent(emojis: string[]) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(emojis.slice(0, MAX_RECENT))); } catch {}
}

export default function EmojiPicker() {
  const t = useTranslations("Tools.EmojiPicker");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Smileys");
  const [recent, setRecent] = useState<string[]>([]);
  const [skinTone, setSkinTone] = useState(0);
  const [tooltip, setTooltip] = useState<{ emoji: string; name: string; codepoint: string } | null>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  const getEmojiWithTone = useCallback((emoji: string): string => {
    if (skinTone === 0) return emoji;
    if (!SKIN_TONE_EMOJIS.has(emoji)) return emoji;
    return emoji + SKIN_TONES[skinTone].suffix;
  }, [skinTone]);

  const copyEmoji = useCallback(async (emoji: string) => {
    const em = getEmojiWithTone(emoji);
    try {
      await navigator.clipboard.writeText(em);
      toast.success(`${t("copied")} ${em}`);
      setRecent((prev) => {
        const next = [em, ...prev.filter((e) => e !== em)].slice(0, MAX_RECENT);
        saveRecent(next);
        return next;
      });
    } catch {
      toast.error(t("copyFailed"));
    }
  }, [getEmojiWithTone, t]);

  const getCodepoint = (emoji: string): string => {
    return [...emoji].map((c) => {
      const cp = c.codePointAt(0);
      return cp ? `U+${cp.toString(16).toUpperCase().padStart(4, "0")}` : "";
    }).filter(Boolean).join(" ");
  };

  const showTooltip = (e: EmojiData) => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    setTooltip({ emoji: e.emoji, name: e.name, codepoint: getCodepoint(e.emoji) });
  };

  const hideTooltip = () => {
    tooltipTimeout.current = setTimeout(() => setTooltip(null), 100);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return ALL_EMOJIS.filter((e) => e.name.toLowerCase().includes(q) || e.emoji.includes(q));
  }, [search]);

  const byCategory = useMemo(() => {
    const map: Record<string, EmojiData[]> = {};
    for (const cat of CATEGORIES) {
      map[cat] = ALL_EMOJIS.filter((e) => e.category === cat);
    }
    return map;
  }, []);

  const EmojiGrid = ({ emojis }: { emojis: EmojiData[] }) => (
    <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-0.5">
      {emojis.map((e) => (
        <button
          key={e.emoji + e.name}
          onClick={() => copyEmoji(e.emoji)}
          onMouseEnter={() => showTooltip(e)}
          onMouseLeave={hideTooltip}
          onFocus={() => showTooltip(e)}
          onBlur={hideTooltip}
          className="w-9 h-9 text-2xl flex items-center justify-center rounded hover:bg-muted transition-colors"
          title={e.name}
          aria-label={e.name}
        >
          {getEmojiWithTone(e.emoji)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Smile className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Skin tone */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">{t("skinTone")}</span>
          {SKIN_TONES.map((tone, i) => (
            <button
              key={tone.label}
              onClick={() => setSkinTone(i)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-base transition-all border-2 ${
                skinTone === i ? "border-primary scale-110" : "border-transparent hover:border-border"
              }`}
              title={tone.label}
            >
              {i === 0 ? "👋" : `👋${tone.suffix}`}
            </button>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <Card className="border py-2 px-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{tooltip.emoji}</span>
              <div>
                <p className="font-medium text-sm capitalize">{tooltip.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{tooltip.codepoint}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Search Results */}
        {filtered !== null ? (
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm flex items-center gap-2">
                {t("searchResults")}
                <Badge variant="secondary">{filtered.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {filtered.length > 0 ? (
                <EmojiGrid emojis={filtered} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">{t("noResults")} &quot;{search}&quot;</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Recently Used */}
            {recent.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t("recentlyUsed")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-0.5">
                    {recent.map((emoji, i) => (
                      <button
                        key={emoji + i}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(emoji);
                            toast.success(`${t("copied")} ${emoji}`);
                            setRecent((prev) => {
                              const next = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, MAX_RECENT);
                              saveRecent(next);
                              return next;
                            });
                          } catch { toast.error(t("copyFailed")); }
                        }}
                        className="w-9 h-9 text-2xl flex items-center justify-center rounded hover:bg-muted transition-colors"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 sm:grid-cols-9 w-full h-auto gap-0.5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="text-xs px-1.5 py-1">
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>

              {CATEGORIES.map((cat) => (
                <TabsContent key={cat} value={cat}>
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <EmojiGrid emojis={byCategory[cat] ?? []} />
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {t("footer")} {ALL_EMOJIS.length} emojis across {CATEGORIES.length} categories.
        </p>
      </div>
    </div>
  );
}
