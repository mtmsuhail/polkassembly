// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InputRef, MenuProps, Tag ,Dropdown, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { IPostTag } from '~src/types';
import { PlusOutlined } from '@ant-design/icons';
import nextApiClientFetch from '~src/util/nextApiClientFetch';
import { poppins } from 'pages/_app';
import handleFilterResults from '~src/util/handleFilterResults';

interface Props{
  tags:string[];
  setTags:(pre:string[])=>void;
  className?:string;
}

const AddTags=({ tags,setTags,className }:Props) => {

	const [ inputVisible, setInputVisible ] = useState(false);
	const [ inputValue, setInputValue ] = useState('');
	const inputRef = useRef<InputRef>(null);
	const [ allTags, setAllTags]=useState<IPostTag[]>([]);
	const [ filteredTags, setFilteredTags ] =useState<IPostTag[]>([]);
	const selectedTag = useRef<string | null>(null);

	const getData= async() => {
		const { data , error } = await nextApiClientFetch<IPostTag[]>('api/v1/all-tags');
		if(error) console.error('Error in getting all-tags', error);
		else if(data ){setAllTags(data); setFilteredTags(data);}
	};

	useEffect(() => {
		allTags.length === 0 && getData();
		handleFilterResults(allTags, setFilteredTags, tags, inputValue);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[inputValue,tags]);

	useEffect(() => {
		if (inputVisible) {
			inputRef.current?.focus();
		}
	}, [inputVisible]);

	const handleClose = (removedTag: string) => {
		const newTags = tags.filter((tag) => tag !== removedTag);
		setTags(newTags);
	};

	const showInput = () => {
		setInputVisible(true);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		selectedTag.current = null;
		setInputValue(e.target.value);

	};

	const handleInputConfirm = () => {

		if(selectedTag.current !== null){
			if ( tags.length < 5 && selectedTag.current && tags.indexOf( selectedTag.current ) === -1 && selectedTag.current !== null){
				setTags([...tags, selectedTag.current.trim()]);
			}
		}
		else{
			if ( inputValue && tags.length < 5 && tags.indexOf( inputValue.toLowerCase() ) === -1 && inputValue.trim().length > 0){
				setTags([...tags, inputValue.trim().toLowerCase()]);
			}}
		selectedTag.current = null;
		setInputValue('');
		setInputVisible(false);

	};

	const items:MenuProps['items']=[
		...filteredTags.slice(0,5).map((tag,index) => {return  { key:index,label:<div className={`text-xs text-navBlue ${poppins.className} ${poppins.className} tracking-wide`} onClick={() => {selectedTag.current = tag?.name; handleInputConfirm(); } }>{tag?.name.charAt(0).toUpperCase()+tag?.name.slice(1)}</div> }; } )];

	return <div className={className}>
		<div className='border-solid border-gray-300 h-[40px] p-[10px] flex rounded border justify-between items-center text-navBlue max-lg:h-auto'>
			<Dropdown
				disabled={tags.length === 5}
				overlayClassName='ml-[-10px] min-w-[104px] rounded create-post' menu={{ items }} placement="topLeft">
				<div className='flex '>
					{ inputVisible ?
						tags.length < 5 &&<Input
							ref={inputRef}
							type="text"
							size="small"
							style={{ width: 78 }}
							value={inputValue}
							onChange={handleInputChange}
							onPressEnter={handleInputConfirm}
							className='text-navBlue rounded-xl bg-white text-xs text-normal px-[16px] py-[4px] mr-2 flex items-center'
						/>  :
						tags.length <5 && <Tag onClick={showInput}className='rounded-xl bg-white border-pink_primary py-[4px] px-[16px] cursor-pointer text-pink_primary text-xs flex items-center' >
							<PlusOutlined className='mr-1'/>
          Add new tag
						</Tag>}
					<div className='max-sm:flex max-sm:flex-col max-sm:gap-1 max-sm:mt-1'>
						{tags.map((tag,index) => (
							<Tag
								key={index}
								className='text-navBlue rounded-xl bg-white text-normal text-xs py-[4px] px-[16px] tracking-wide hover:border-pink_primary'
								closable
								onClose={(e) => {e.preventDefault();handleClose(tag);}}>{tag.charAt(0).toUpperCase()+tag.slice(1)}</Tag>))}
					</div></div></Dropdown>
			<div className={`text-xs  ${  5 - tags.length === 0 ? 'text-pink_primary':'text-navBlue' }`}>{5-(tags.length)} Tags left</div>
		</div></div>;
};
export default AddTags;
