// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Avatar } from 'antd';
import React, { FC } from 'react';
import DefaultProfile from '~assets/icons/dashboard-profile.svg';

interface IImageComponentProps {
	className?: string;
	src: any;
	alt: string;
	iconClassName?: string;
}

const ImageComponent: FC<IImageComponentProps> = (props) => {
	const { alt, className, src = '', iconClassName } = props;
	const regex = /\.(jpg|jpeg|png|gif|bmp|svg|tiff|ico)$/;
	return (
		<Avatar
			className={className}
			src={regex.test(src) ? src : '/assets/icons/user-profile.png'}
			alt={alt}
			icon={
				regex.test(src) ? null : (
					<span className={iconClassName}>
						<DefaultProfile />
					</span>
				)
			}
		/>
	);
};

export default ImageComponent;
