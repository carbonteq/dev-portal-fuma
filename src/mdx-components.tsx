import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import Section from '@/components/ui/Section';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import CustomCard from '@/components/ui/CustomCard';
import ContentCard from '@/components/ui/ContentCard';
import Aside from '@/components/ui/Aside';
import { Code } from '@/components/ui/Code';
import { BestPractice } from '@/components/ui/BestPractice';
import { Layers } from '@/components/ui/design-system/Layers';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Section,
    Row,
    Col,
    CustomCard,
    ContentCard,
    Aside,
    ...components,
    Code,
    BestPractice,
    Layers,
  };
}
