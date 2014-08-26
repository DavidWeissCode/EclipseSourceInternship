/*******************************************************************************
 * Copyright (c) 2013 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.rap.demo.ckeditor;

import org.eclipse.rap.addons.ckeditor.CKEditor;
import org.eclipse.rap.rwt.application.AbstractEntryPoint;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.Font;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.ToolBar;
import org.eclipse.swt.widgets.ToolItem;


public class CkEditorDemo extends AbstractEntryPoint {

private CKEditor ckEditor;

@Override
  protected void createContents( final Composite parent ) {
    getShell().setText( "CkEditor Demo" );
    parent.setLayout( new GridLayout( 1, false ) );
    
    createCKEditor(parent);
    
    // Toolbar
    final ToolBar toolbar = new ToolBar( parent, SWT.FLAT );
    ToolItem printBtn = new ToolItem( toolbar, SWT.PUSH );
    printBtn.setText( "Print" );
    printBtn.addSelectionListener( new SelectionAdapter() {
      @Override
      public void widgetSelected( SelectionEvent e ) {
        System.out.println( ckEditor.getText() );
      }
    } );
    ToolItem destrBtn = new ToolItem( toolbar, SWT.PUSH );
    destrBtn.setText( "Dispose" );
    destrBtn.addSelectionListener( new SelectionAdapter() {
      @Override
      public void widgetSelected( SelectionEvent e ) {
        ckEditor.dispose();
      }
    } );
    ToolItem fontBtn = new ToolItem( toolbar, SWT.PUSH );
    fontBtn.setText( "Font" );
    fontBtn.addSelectionListener( new SelectionAdapter() {
      @Override
      public void widgetSelected( SelectionEvent e ) {
        ckEditor.setFont( new Font( parent.getDisplay(), "serif", 9, 0 ) );
      }
    } );
    ToolItem clearBtn = new ToolItem( toolbar, SWT.NONE );
    clearBtn.setText( "Clear" );
    clearBtn.addSelectionListener( new SelectionAdapter() {
      @Override
      public void widgetSelected( SelectionEvent e ) {
        ckEditor.setText( "" );
      }
    } );
    ToolItem recreateBtn = new ToolItem( toolbar, SWT.PUSH );
    recreateBtn.setText( "Recreate" );
    recreateBtn.addSelectionListener( new SelectionAdapter() {
      @Override
      public void widgetSelected( SelectionEvent e ) {
        String oldText = ckEditor.getText();
    	ckEditor.dispose();
    	createCKEditor( parent );
    	ckEditor.moveAbove(toolbar);
    	ckEditor.setText(oldText);
        parent.layout();
      }
    } );
    ToolItem redBtn = new ToolItem( toolbar, SWT.PUSH );
    redBtn.setText( "Set Red Background" );
    redBtn.addSelectionListener( new SelectionAdapter() {
      @Override
      public void widgetSelected( SelectionEvent e ) {
        ckEditor.setRed();
      }
    } );
    
  }

private void createCKEditor(final Composite parent) {
	ckEditor = new CKEditor( parent, SWT.NONE );
    ckEditor.setFont( new Font( parent.getDisplay(), "arial", 30, SWT.NONE) );
    ckEditor.setText( "Hello Arial Font" );
    System.out.println( ckEditor.getText() );
    int rgb1 = (int) Math.floor(Math.random()*256);
    int rgb2 = (int) Math.floor(Math.random()*256);
    int rgb3 = (int) Math.floor(Math.random()*256);
    ckEditor.setBackground( new Color(parent.getDisplay(), rgb1, rgb2, rgb3) );
    ckEditor.setLayoutData( new GridData( SWT.FILL, SWT.FILL, true, true ) );
}

}
