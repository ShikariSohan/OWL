/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.extraPlugins='codesnippet,lineutils,widget',
	config.codeSnippet_theme ='atelier-heath.light',
	config.removeButtons = 'NewPage,Form,Checkbox,Save,Print,Source,Radio,Button,TextField,Textarea,Select,HiddenField,ImageButton,Table,Iframe,Anchor,Cut,Copy,Pdf,Preview,Template,Paste,Language,Upload,Indent,ShowBlocks,Insert';

};
