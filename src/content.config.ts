// Coleções de conteúdo. O conteúdo fica em repositório separado; aqui o site só lê.
// A pasta vem de CONTEUDO_DIR. Sem ela, usa conteudo/ (cópia local do repositório de conteúdo).

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { resolve } from 'node:path';

export const CONTEUDO_DIR = resolve(process.env.CONTEUDO_DIR ?? './conteudo');

// Identificador = caminho sem extensão: "agenda-de-salas/index.pt", "cv.pt".
const porCaminho = ({ entry }: { entry: string }) => entry.replace(/\.(md|ya?ml)$/, '');

const idioma = z.enum(['pt', 'en']);
const anoMes = z.string().regex(/^\d{4}-\d{2}$/, 'use AAAA-MM');
const exemplo = z.boolean().default(false);

const posts = defineCollection({
  loader: glob({ pattern: '*/index.*.md', base: `${CONTEUDO_DIR}/posts`, generateId: porCaminho }),
  schema: z.object({
    exemplo,
    titulo: z.string(),
    resumo: z.string(),
    data: z.coerce.date(),
    atualizado: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    idioma,
    rascunho: z.boolean().default(false),
    slug: z.string().optional(),
    pontilhar: z.boolean().default(false),
  }),
});

const projetos = defineCollection({
  loader: glob({ pattern: '*/index.*.md', base: `${CONTEUDO_DIR}/projetos`, generateId: porCaminho }),
  schema: z.object({
    exemplo,
    titulo: z.string(),
    resumo: z.string(),
    periodo: z.object({ inicio: anoMes, fim: anoMes.optional() }),
    status: z.enum(['concluido', 'em-andamento', 'pausado', 'abandonado']),
    stack: z.array(z.string()).default([]),
    links: z.object({ repositorio: z.string().url().optional(), demo: z.string().url().optional() }).default({}),
    destaque: z.boolean().default(false),
    estudo_de_caso: z.boolean().default(false),
    idioma,
    slug: z.string().optional(),
  }),
});

const pesquisa = defineCollection({
  loader: glob({ pattern: '*/index.*.md', base: `${CONTEUDO_DIR}/pesquisa`, generateId: porCaminho }),
  schema: z.object({
    exemplo,
    titulo: z.string(),
    tipo: z.enum(['artigo', 'monografia', 'apresentacao', 'poster']),
    ano: z.number().int(),
    autores: z.array(z.string()).min(1),
    local: z.string(),
    arquivo: z.string().optional(),
    doi: z.string().optional(),
    idioma,
    slug: z.string().optional(),
  }),
});

const data = z.union([anoMes, z.null()]).optional();

const cv = defineCollection({
  loader: glob({ pattern: 'cv.*.yaml', base: `${CONTEUDO_DIR}/cv`, generateId: porCaminho }),
  schema: z.object({
    exemplo,
    basico: z.object({
      nome: z.string(),
      cargo: z.string(),
      resumo: z.string(),
      email: z.string(),
      site: z.string().url(),
      local: z.string(),
      perfis: z.array(z.object({ rede: z.string(), url: z.string().url() })).default([]),
    }),
    experiencia: z.array(z.object({
      empresa: z.string(),
      cargo: z.string(),
      inicio: data,
      fim: data,
      local: z.string().optional(),
      resumo: z.string().optional(),
      destaques: z.array(z.string()).default([]),
    })).default([]),
    formacao: z.array(z.object({
      instituicao: z.string(),
      curso: z.string(),
      inicio: data,
      fim: data,
    })).default([]),
    habilidades: z.array(z.object({ area: z.string(), itens: z.array(z.string()) })).default([]),
    idiomas: z.array(z.object({ idioma: z.string(), nivel: z.string() })).default([]),
    publicacoes: z.array(z.object({ pesquisa: z.string() })).default([]),
  }),
});

// Uma opção leva a outro nó (vai_para) ou abre um app (abre), nunca os dois.
const opcao = z.object({
  texto: z.string(),
  vai_para: z.string().optional(),
  abre: z.string().optional(),
}).refine((o) => Boolean(o.vai_para) !== Boolean(o.abre), 'cada opção tem vai_para ou abre');

const conversa = defineCollection({
  loader: glob({ pattern: 'conversa.*.yaml', base: `${CONTEUDO_DIR}/sobre`, generateId: porCaminho }),
  schema: z.object({
    exemplo,
    atalhos: z.array(z.object({ texto: z.string(), abre: z.string() })).default([]),
    inicio: z.string(),
    nos: z.record(z.string(), z.object({
      mensagens: z.array(z.string()).min(1),
      proximo: z.string().optional(),
      opcoes: z.array(opcao).optional(),
    }).refine((n) => Boolean(n.proximo) !== Boolean(n.opcoes), 'cada nó termina com proximo ou opcoes')),
  }).superRefine((c, ctx) => {
    // Todo destino precisa existir.
    const nos = new Set(Object.keys(c.nos));
    const destinos = [c.inicio, ...Object.values(c.nos).flatMap((n) => [n.proximo, ...(n.opcoes ?? []).map((o) => o.vai_para)])];
    for (const d of destinos) if (d && !nos.has(d)) ctx.addIssue({ code: 'custom', message: `nó inexistente: ${d}` });
  }),
});

const contato = defineCollection({
  loader: glob({ pattern: 'contato.yaml', base: `${CONTEUDO_DIR}/contato`, generateId: porCaminho }),
  schema: z.object({
    exemplo,
    email: z.object({ pt: z.string(), en: z.string() }),
    profissionais: z.array(z.object({ rede: z.string(), url: z.string().url() })).default([]),
    pessoais: z.array(z.object({ rede: z.string(), url: z.string().url(), observacao: z.string().optional() })).default([]),
  }),
});

export const collections = { posts, projetos, pesquisa, cv, conversa, contato };
