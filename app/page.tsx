"use client";

import React, { useState } from 'react';
import fetch from 'isomorphic-fetch';
import { env } from 'process';

export default function Home() {
  const [itemName, setItemName] = useState('');
  const [style, setStyle] = useState('pixel');
  const [level, setLevel] = useState('normal');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = generatePrompt(itemName, style, level);
    console.log(`Generated prompt: ${prompt}`);
    setLoading(true);
    const imageUrl = await generateImage(prompt);
    console.log(`Generated image URL: ${imageUrl}`);
    setImageUrl(imageUrl);
    setLoading(false);
  };

  const generateImage = async (prompt: string) => {
    const path = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";
    const apiKey = process.env.API_KEY;
    
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    };

    const body = {
      steps: 40,
      width: 1024, // 使用允许的宽度
      height: 1024, // 使用允许的高度
      seed: 0,
      cfg_scale: 5,
      samples: 1,
      text_prompts: [
        {
          text: prompt,
          weight: 1
        }
      ],
    };

    const response = await fetch(path, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }
  
    const responseJSON = await response.json();
    const imageBase64 = responseJSON.artifacts[0].base64;

    // 返回缩略图
    return `data:image/png;base64,${imageBase64}`;
  };

  const generatePrompt = (itemName: string, style: string, level: string): string => {
    const itemDescription = `a detailed ${level} level ${itemName}`;
    const styleDescription = `in ${style} style`;
    const gameStyle = "for a fantasy game";
    const usage = "used as an in-game item icon";
    const lighting = "with ambient occlusion and realistic lighting";
    const background = "on a transparent background";

    return `${itemDescription}, ${styleDescription}, ${gameStyle}, ${usage}, ${lighting}, ${background}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">
            道具名称
          </label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="style">
            风格
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="pixel">像素风</option>
            <option value="concept art">概念艺术</option>
            <option value="photorealistic">照片真实感</option>
            <option value="cyberpunk">赛博朋克</option>
            <option value="steampunk">蒸汽朋克</option>
            <option value="fantasy">奇幻风格</option>
            <option value="sci-fi">科幻风格</option>
            <option value="cartoon">卡通风格</option>
            <option value="retro">复古风</option>
            {/* 你可以在这里添加更多风格选项 */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
            等级
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="normal">普通</option>
            <option value="elite">精英</option>
            <option value="epic">史诗</option>
            {/* 你可以在这里添加更多等级选项 */}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            生成道具
          </button>
        </div>
      </form>

      {loading && <div>Loading...</div>}

      {imageUrl && (
        <div className="mt-8">
          <img src={imageUrl} alt="Generated Item" className="rounded shadow-lg max-w-xs max-h-xs" />
        </div>
      )}
    </main>
  );
  
}