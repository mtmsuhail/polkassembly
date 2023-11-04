// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import styled from 'styled-components';
import remarkGfm from 'remark-gfm';

interface Props {
	className?: string;
	isPreview?: boolean;
	isAutoComplete?: boolean;
	md: string;
	imgHidden?: boolean;
	theme?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Markdown = ({ className, isPreview = false, isAutoComplete = false, md, imgHidden = false, theme }: Props) => {
	const sanitisedMd = md?.replace(/\\n/g, '\n');

	return (
		<ReactMarkdown
			className={`${className} ${isPreview && 'mde-preview-content'} ${imgHidden && 'hide-image'} ${isAutoComplete && 'mde-autocomplete-content'} dark-text-white`}
			rehypePlugins={[rehypeRaw, remarkGfm]}
			linkTarget='_blank'
		>
			{sanitisedMd}
		</ReactMarkdown>
	);
};

export default styled(Markdown)`
	&,
	&.mde-preview-content {
		font-size: 14px;
		margin-bottom: 0;
		overflow-wrap: break-word;
		overflow-x: auto;

		.hide-image img {
			display: none !important;
		}

		th,
		td {
			border: 1px solid;
			padding: 0.5rem;
		}

		hr {
			margin: 1rem 0;
		}

		p,
		blockquote,
		ul,
		ol,
		dl,
		table {
			line-height: 160%;
			margin: 0 0 0.5rem 0;
			color: ${(props) => (props.theme == 'dark' ? 'white' : '#243A57')} !important;
			font-weight: ${(props) => (props.theme == 'dark' ? '300' : '500')} !important;
		}

		h1 {
			font-size: 1.5rem;
			margin-bottom: 2rem;
		}

		h2 {
			font-size: 1.3rem;
			margin: 2rem 0 1rem 0;
			font-weight: ${(props) => (props.theme == 'dark' ? '400' : '500')} !important;
		}

		h3,
		h4 {
			font-size: 1.2rem;
			margin-bottom: 0.8rem;
			font-weight: ${(props) => (props.theme == 'dark' ? '400' : '500')} !important;
		}

		ul,
		ol {
			padding-left: 2rem;
			font-weight: ${(props) => (props.theme == 'dark' ? '300' : '500')} !important;

			li {
				padding-left: 0.8rem;
				margin-bottom: 1.2rem;
				font-weight: ${(props) => (props.theme == 'dark' ? '300' : '500')} !important;
			}

			li > input {
				display: none;
			}
		}

		a {
			color: ${(props) => (props.theme == 'dark' ? '#FF60B5' : '#e5007a')} !important;

			&:hover {
				text-decoration: none;
				color: ${(props) => (props.theme == 'dark' ? '#FF60B5' : '#c40061')} !important;
			}
		}

		blockquote {
			margin: 1rem 0;
			padding: 0 1em;
			color: grey_primary;
			border-left-style: solid;
			border-left-width: 0.25rem;
			border-left-color: grey_primary;
			font-size: 0.9rem;
			& > :first-child {
				margin-top: 0;
			}
			& > :last-child {
				margin-bottom: 0;
			}
		}

		img {
			max-width: 100%;
			margin: 2rem 0;
		}

		pre {
			background-color: ${(props) => (props.theme === 'dark' ? '#2c2f32' : '#ebf0f5')} !important;
			overflow: auto;
			border-radius: 0.3rem;
		}

		code {
			font-size: 12px;
			margin: 0;
			border-radius: 3px;
			white-space: pre-wrap;
			&::before,
			&::after {
				letter-spacing: -0.2em;
			}

			padding-left: 4px;
			padding-right: 4px;
			background-color: ${(props) => (props.theme === 'dark' ? '#222' : '#fbfbfd')} !important;
			color: ${(props) => (props.theme === 'dark' ? '#fff' : '#000')} !important;
		}
	}

	&.mde-preview-content {
		h1,
		h2,
		h3,
		h4 {
			border-bottom: none;
		}

		h1,
		h2 {
			font-size: 1.3rem;
			font-weight: 400;
		}

		h3,
		h4 {
			font-size: 1.2rem;
			font-weight: 500;
		}

		h3 {
			font-family: font_default !important;
		}
	}

	&.mde-autocomplete-content {
		margin-top: 4px !important;
		color: var(--bodyBlue);
		font-weight: 700;

		mark {
			margin-top: -3px;
			margin-right: -2px;
			font-weight: 500;
			color: #485f7d !important;
			background: none !important;
		}

		&:hover {
			color: pink_primary !important;
		}
	}
`;
