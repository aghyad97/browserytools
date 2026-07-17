import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        La diferencia entre una respuesta de IA mediocre y una genuinamente útil rara vez tiene que
        ver con las capacidades del modelo —casi siempre tiene que ver con cómo se escribió el prompt.
        La estructura, la claridad y las indicaciones de formato correctas pueden convertir un resultado
        vago y divagante en una respuesta precisa y accionable. Si alguna vez has sentido que una
        herramienta de IA no está a la altura de su potencial, el formato del prompt es lo primero que
        vale la pena examinar.
      </p>
      <ToolCTA slug="prompt-formatter" variant="inline" />
      <p>
        Puedes usar el{" "}
        <a href="/tools/prompt-formatter">Formateador de Prompts de BrowseryTools</a> —gratis, sin
        registro, todo se queda en tu navegador— para limpiar, reestructurar y refinar tus prompts
        antes de enviarlos a cualquier modelo de IA.
      </p>

      <h2>Por Qué el Formato Importa Más de lo Que Crees</h2>
      <p>
        Los modelos de lenguaje no leen los prompts como un humano hojea un mensaje. Procesan tokens
        secuencialmente y son sensibles a cómo se formulan, ordenan y separan las instrucciones. Un
        prompt escrito como un largo párrafo ininterrumpido entierra las instrucciones más importantes
        en el medio —exactamente donde es menos probable que influyan en el resultado. Un prompt bien
        formateado coloca las restricciones y los objetivos al principio, usa delimitadores claros entre
        secciones e indica explícitamente el formato de salida esperado.
      </p>
      <p>
        Piensa en el formato de los prompts como escribir un briefing para un contratista. Cuanto más
        precisamente especifiques el entregable, las restricciones y el contexto, más cerca estará el
        primer borrador de lo que realmente necesitas.
      </p>

      <h2>Técnica 1: Asignación de Rol</h2>
      <p>
        Una de las técnicas de formato más efectivas es asignarle un rol al modelo antes de la tarea
        real. Esto activa un registro específico y un conjunto de convenciones que el modelo asocia con
        ese rol, produciendo un resultado más consistente.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Sin rol:
"Explain how to write a good README."

✅ Con rol:
"You are a senior open-source maintainer who reviews hundreds of repositories.
Explain how to write a README that communicates a project's value clearly
to both technical and non-technical readers."`}
      </pre>
      <p>
        El encuadre del rol no restringe al modelo —lo enfoca. Obtienes una escritura que coincide con
        los estándares y el vocabulario del personaje, en lugar de una visión general genérica.
      </p>

      <h2>Técnica 2: Bloques de Instrucciones Claros</h2>
      <p>
        Separa la descripción de la tarea, el contexto y las restricciones en secciones distintas. Los
        encabezados de Markdown y los delimitadores de triple acento grave funcionan bien aquí. Muchos
        modelos han sido entrenados con documentos con esta estructura y responden bien a ella.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Task
Summarize the following customer feedback into three actionable product priorities.

## Context
This is feedback from B2B SaaS users collected over Q4 2025. The audience for
this summary is a product manager preparing for a sprint planning session.

## Constraints
- Maximum 150 words total
- Use bullet points
- Do not include direct quotes

## Input
"""
[customer feedback goes here]
"""`}
      </pre>
      <p>
        Las secciones etiquetadas dejan inmediatamente claro qué pertenece a dónde. Puedes ajustar el
        contexto o las restricciones de forma independiente sin reescribir todo el prompt.
      </p>

      <h2>Técnica 3: Ejemplos de Few-Shot</h2>
      <p>
        Si necesitas el resultado en un estilo o formato específico, la técnica más fiable es incluir
        uno o dos ejemplos de lo que quieres. Esto se llama prompting de few-shot y supera
        consistentemente a las largas descripciones verbales del formato deseado.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Convert a raw feature request into a user story using the following format.

Example input: "Users want to export data to CSV"
Example output: "As a data analyst, I want to export my dashboard data to CSV
so that I can perform custom analysis in spreadsheet tools."

Now convert: "Users want to be notified when a report is ready"`}
      </pre>
      <p>
        Observa que el ejemplo define tanto la estructura («Como… quiero… para poder…») como el nivel de
        especificidad esperado. No necesitas explicar el formato en prosa —el ejemplo lo muestra.
      </p>

      <h2>Técnica 4: Prompting de Cadena de Pensamiento</h2>
      <p>
        Para tareas de razonamiento —depuración, análisis, cálculos, toma de decisiones— pedir
        explícitamente al modelo que piense paso a paso antes de dar una respuesta final mejora
        dramáticamente la precisión. Esto no es un truco: cambia cómo el modelo asigna su computación
        interna durante la generación.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Sin cadena de pensamiento:
"What is the best database for a real-time multiplayer game?"

✅ Con cadena de pensamiento:
"What is the best database for a real-time multiplayer game?
Think through the requirements step by step — latency, concurrency model,
data structure, consistency guarantees — before giving your recommendation."`}
      </pre>
      <p>
        La instrucción paso a paso expone el razonamiento intermedio que puedes evaluar. También es
        mucho más probable que detectes errores cuando puedes ver la cadena de razonamiento en lugar de
        solo una conclusión.
      </p>

      <h2>Técnica 5: Prompts Estructurados con XML y JSON</h2>
      <p>
        Cuando necesitas que el propio resultado sea estructurado —un objeto JSON, una tabla, un esquema
        específico— haz que el formato de salida sea explícito y usa una estructura correspondiente en
        el prompt. Claude y GPT-4 responden especialmente bien a las secciones etiquetadas con XML.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`<task>Extract the following fields from the job description below.</task>

<output_format>
{
  "job_title": "string",
  "required_skills": ["string"],
  "seniority_level": "junior | mid | senior",
  "remote_policy": "remote | hybrid | on-site | not specified"
}
</output_format>

<input>
[job description text here]
</input>`}
      </pre>
      <p>
        Las etiquetas XML actúan como delimitadores inequívocos. El modelo sabe exactamente dónde
        terminan sus instrucciones y dónde comienzan los datos de entrada, reduciendo el riesgo de
        que el modelo trate tus instrucciones como parte del contenido a procesar.
      </p>

      <h2>Errores Comunes de Formato de Prompts</h2>
      <ul>
        <li><strong>Enterrar la instrucción principal</strong> — Pon lo que quieres que haga el modelo al
        principio, no después de tres párrafos de contexto. Los modelos dan más peso a los tokens anteriores.</li>
        <li><strong>Restricciones contradictorias</strong> — «Sé conciso pero cubre cada detalle» obliga al
        modelo a hacer una compensación arbitraria. Especifica cuál importa más.</li>
        <li><strong>Asumir contexto compartido</strong> — El modelo no tiene memoria de tus sesiones anteriores.
        Incluye todo el contexto relevante en el propio prompt.</li>
        <li><strong>No especificar el formato de salida</strong> — Si necesitas una lista, di lista. Si necesitas
        JSON, di JSON. Si necesitas una respuesta de menos de 200 palabras, dilo. Formato no especificado = salida
        impredecible.</li>
        <li><strong>Reglas de estilo sobrespecificadas</strong> — Las largas listas de instrucciones negativas
        («no hagas X, nunca digas Y») consumen contexto y a menudo producen resultados rígidos y torpes. Una
        o dos restricciones sólidas superan a diez débiles.</li>
      </ul>

      <h2>Antes y Después: La Misma Solicitud, Reformateada</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Before:
"Can you help me write an email to my boss about a project delay?
We were supposed to launch the new payment integration last Friday but
the third-party API had some issues and now we're looking at maybe
next Wednesday or Thursday, can you make it professional?"

✅ After:
You are an experienced business communicator.

## Task
Write a professional delay notification email from a developer to their manager.

## Context
- Project: payment gateway integration
- Original deadline: last Friday
- New estimate: Wednesday or Thursday this week
- Cause: issues with a third-party API (not our team's fault)

## Tone
Professional, direct, and solution-focused — not defensive or apologetic

## Output
Subject line + email body, under 150 words`}
      </pre>
      <p>
        La versión reformateada tarda 20 segundos adicionales en escribirse y produce un resultado que
        es inmediatamente utilizable, en lugar de requerir dos o tres correcciones de seguimiento.
      </p>

      <h2>Cómo Usar el Formateador de Prompts</h2>
      <p>
        El{" "}
        <a href="/tools/prompt-formatter">Formateador de Prompts de BrowseryTools</a> te ayuda a aplicar
        estas técnicas sin memorizar cada regla. Pega tu prompt en bruto, elige la estructura que se
        adapte a tu caso de uso y obtén una versión limpia y bien organizada lista para enviar a
        ChatGPT, Claude, Gemini o cualquier otro modelo. No se necesita cuenta y tus prompts nunca
        salen de tu navegador.
      </p>

      <h2>Resumen</h2>
      <p>
        El formato de prompts es una habilidad aprendible con una recompensa mensurable. La asignación
        de roles enfoca al modelo, los separadores de secciones claros eliminan la ambigüedad, los
        ejemplos de few-shot definen el formato esperado y las restricciones de salida explícitas
        eliminan las conjeturas. El mejor prompt no es el más elaborado —es el que deja menos preguntas
        sin responder antes de que comience la generación.
      </p>
      <ToolCTA slug="prompt-formatter" variant="card" />
    </div>
  );
}
